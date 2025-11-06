import React from 'react';
import { Page, User } from '../types';
import { LynixLogo, SoftphoneIcon } from './icons';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    loggedInUser: User | null;
    onSignOut: () => void;
}

const NavButton: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => {
    const isActive = currentPage === page;
    const baseClasses = "px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform";
    const activeClasses = "bg-blue-600 ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-800 shadow-lg scale-105";
    const inactiveClasses = "bg-gray-700 hover:bg-gray-600 hover:scale-105";

    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {children}
            {isActive && <span className="hidden md:inline"> (Your on this Page)</span>}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, loggedInUser, onSignOut }) => {
    const baseButtonClasses = "px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform bg-gray-700 hover:bg-gray-600 hover:scale-105";
    return (
        <header className="bg-gray-800 bg-opacity-70 backdrop-blur-sm text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setCurrentPage(Page.Home)}
                    >
                        <div className="flex items-center gap-2 bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-transform hover:scale-105">
                            <LynixLogo />
                            <span className="text-xl font-bold">Lynix</span>
                        </div>
                    </div>
                    <h1 className="text-lg sm:text-2xl font-bold hidden sm:block">Lynix Technology and Coding</h1>
                </div>
                
                <nav className="flex items-center gap-2 md:gap-4">
                    <a 
                        href="https://darshanjoshuakesavaruban.fwscheckout.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={baseButtonClasses}
                    >
                        Buy a product
                    </a>
                    <a 
                        href="https://sites.google.com/gcp.lynixity.x10.bz/myportal/home" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={baseButtonClasses}
                    >
                        MyPortal
                    </a>
                    {loggedInUser && (
                        <NavButton page={Page.Softphone} currentPage={currentPage} setCurrentPage={setCurrentPage}>
                             <div className="flex items-center justify-center gap-2">
                                <SoftphoneIcon />
                                <span>Softphone</span>
                            </div>
                        </NavButton>
                    )}
                    <NavButton page={Page.Contact} currentPage={currentPage} setCurrentPage={setCurrentPage}>
                        Contact Us
                    </NavButton>
                    <NavButton page={Page.Home} currentPage={currentPage} setCurrentPage={setCurrentPage}>
                        Home
                    </NavButton>
                    {loggedInUser ? (
                        <>
                            {loggedInUser.role === 'admin' && (
                                <NavButton page={Page.Admin} currentPage={currentPage} setCurrentPage={setCurrentPage}>
                                    Admin
                                </NavButton>
                            )}
                            <NavButton page={Page.Profile} currentPage={currentPage} setCurrentPage={setCurrentPage}>
                                Profile
                            </NavButton>
                            <button onClick={onSignOut} className={`${baseButtonClasses} bg-purple-600 hover:bg-purple-700`}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <NavButton page={Page.SignOn} currentPage={currentPage} setCurrentPage={setCurrentPage}>
                            Sign On
                        </NavButton>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;