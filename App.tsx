import React, { useState, useCallback } from 'react';
import { Page, User } from './types';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import SignOnPage from './components/SignOnPage';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import GeminiChat from './components/GeminiChat';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const handleLoginSuccess = useCallback((user: User) => {
        setLoggedInUser(user);
        if (user.role === 'admin') {
            setCurrentPage(Page.Admin);
        } else {
            setCurrentPage(Page.Profile);
        }
    }, []);

    const handleSignOut = useCallback(() => {
        setLoggedInUser(null);
        setCurrentPage(Page.Home);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case Page.Home:
                return <HomePage />;
            case Page.Contact:
                return <ContactPage />;
            case Page.SignOn:
                return loggedInUser 
                    ? <ProfilePage user={loggedInUser} onSignOut={handleSignOut} /> 
                    : <SignOnPage onLoginSuccess={handleLoginSuccess} />;
            case Page.Profile:
                 return loggedInUser 
                    ? <ProfilePage user={loggedInUser} onSignOut={handleSignOut} /> 
                    : <SignOnPage onLoginSuccess={handleLoginSuccess} />;
            case Page.Admin:
                 return loggedInUser && loggedInUser.role === 'admin'
                    ? <AdminPage />
                    : <HomePage />;
            default:
                return <HomePage />;
        }
    };
    
    const toggleChat = useCallback(() => {
        setIsChatOpen(prev => !prev);
    }, []);

    const handleSetCurrentPage = useCallback((page: Page) => {
        if (loggedInUser && page === Page.SignOn) {
            setCurrentPage(Page.Profile);
        } else if (page === Page.Admin && loggedInUser?.role !== 'admin') {
            setCurrentPage(Page.Home);
        }
        else {
            setCurrentPage(page);
        }
    }, [loggedInUser]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-600 via-teal-500 to-green-400 font-sans">
            <Header 
                currentPage={currentPage} 
                setCurrentPage={handleSetCurrentPage} 
                loggedInUser={loggedInUser}
                onSignOut={handleSignOut}
            />
            <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
                {renderPage()}
            </main>
            <Footer toggleChat={toggleChat} />
            <GeminiChat isOpen={isChatOpen} onClose={toggleChat} />
        </div>
    );
};

export default App;