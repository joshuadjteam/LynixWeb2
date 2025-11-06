import React, { useState, useCallback, useEffect } from 'react';
import { Page, User, GuestSession } from './types';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import SignOnPage from './components/SignOnPage';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import SoftphonePage from './components/SoftphonePage';
import LynxAiPage from './components/LynxAiPage';
import AiChoiceModal from './components/AiChoiceModal';
import ChatPage from './components/ChatPage';
import Footer from './components/Footer';

const GUEST_SESSION_KEY = 'lynixGuestAiSession';
const GUEST_MESSAGE_LIMIT = 50;
const GUEST_SESSION_DURATION = 60 * 60 * 1000; // 1 hour

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [isAiChoiceModalOpen, setIsAiChoiceModalOpen] = useState(false);
    const [loginRedirectToAi, setLoginRedirectToAi] = useState(false);
    const [guestSession, setGuestSession] = useState<GuestSession | null>(null);

    const handleLoginSuccess = useCallback((user: User) => {
        setLoggedInUser(user);
        if (loginRedirectToAi && user.ai_enabled) {
            setCurrentPage(Page.LynxAI);
            setLoginRedirectToAi(false);
        } else if (user.role === 'admin') {
            setCurrentPage(Page.Admin);
        } else {
            setCurrentPage(Page.Profile);
        }
    }, [loginRedirectToAi]);

    const handleSignOut = useCallback(() => {
        setLoggedInUser(null);
        setCurrentPage(Page.Home);
    }, []);

    const handleSelectLynixId = () => {
        setLoginRedirectToAi(true);
        setCurrentPage(Page.SignOn);
        setIsAiChoiceModalOpen(false);
    };

    const handleSelectGuest = () => {
        let session: GuestSession | null = null;
        try {
            const storedSession = localStorage.getItem(GUEST_SESSION_KEY);
            if (storedSession) {
                const parsed = JSON.parse(storedSession) as GuestSession;
                if (parsed.resetTime && Date.now() > parsed.resetTime) {
                    // Session expired, create a new one
                    session = { responsesLeft: GUEST_MESSAGE_LIMIT, resetTime: null };
                } else {
                    session = parsed;
                }
            } else {
                session = { responsesLeft: GUEST_MESSAGE_LIMIT, resetTime: null };
            }
        } catch (error) {
            console.error("Failed to read guest session from localStorage:", error);
            session = { responsesLeft: GUEST_MESSAGE_LIMIT, resetTime: null };
        }
        
        localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
        setGuestSession(session);
        setCurrentPage(Page.LynxAI);
        setIsAiChoiceModalOpen(false);
    };
    
    const handleGuestMessageSent = () => {
        setGuestSession(prevSession => {
            if (!prevSession) return null;
            
            const isFirstMessage = prevSession.resetTime === null;
            const newResetTime = isFirstMessage ? Date.now() + GUEST_SESSION_DURATION : prevSession.resetTime;
            const newResponsesLeft = Math.max(0, prevSession.responsesLeft - 1);
            
            const newSession: GuestSession = {
                responsesLeft: newResponsesLeft,
                resetTime: newResetTime
            };

            localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(newSession));
            return newSession;
        });
    };

    const canAccessAI = loggedInUser && loggedInUser.ai_enabled && (loggedInUser.role === 'admin' || loggedInUser.role === 'standard') && loggedInUser.billing.status !== 'Suspended';
    const canAccessChat = loggedInUser && loggedInUser.chat_enabled;

    useEffect(() => {
        if (currentPage !== Page.LynxAI) {
            setGuestSession(null); // Clear guest session when navigating away
        }
    }, [currentPage]);
    
    const renderPage = () => {
        switch (currentPage) {
            case Page.Home: return <HomePage />;
            case Page.Contact: return <ContactPage />;
            case Page.SignOn: return <SignOnPage onLoginSuccess={handleLoginSuccess} />;
            case Page.Profile: return loggedInUser ? <ProfilePage user={loggedInUser} onSignOut={handleSignOut} setCurrentPage={setCurrentPage} /> : <SignOnPage onLoginSuccess={handleLoginSuccess} />;
            case Page.Admin: return loggedInUser?.role === 'admin' ? <AdminPage /> : <HomePage />;
            case Page.Softphone: return loggedInUser ? <SoftphonePage /> : <SignOnPage onLoginSuccess={handleLoginSuccess} />;
            case Page.Chat: return canAccessChat ? <ChatPage currentUser={loggedInUser} /> : <HomePage />;
            case Page.LynxAI:
                if (canAccessAI) {
                    return <LynxAiPage user={loggedInUser} />;
                }
                if (guestSession) {
                    return <LynxAiPage guestSession={guestSession} onGuestMessageSent={handleGuestMessageSent} />;
                }
                // If tried to access directly without credentials or guest session
                return <HomePage />;
            default: return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-600 via-teal-500 to-green-400 font-sans">
            <style>{`
                /* ... animation styles ... */
            `}</style>
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} loggedInUser={loggedInUser} onSignOut={handleSignOut} />
            <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
                <div key={currentPage} className="animate-page-transition w-full flex items-center justify-center">
                    {renderPage()}
                </div>
            </main>
            { currentPage !== Page.LynxAI && <Footer onOpenAiChoiceModal={() => setIsAiChoiceModalOpen(true)} /> }
            {isAiChoiceModalOpen && (
                <AiChoiceModal 
                    onClose={() => setIsAiChoiceModalOpen(false)}
                    onSelectLynixId={handleSelectLynixId}
                    onSelectGuest={handleSelectGuest}
                />
            )}
        </div>
    );
};

export default App;