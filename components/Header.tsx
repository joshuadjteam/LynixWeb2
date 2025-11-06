import React, { useState, useEffect, useRef } from 'react';
import { Page, User, Alert } from '../types';
import { LynixLogo, SoftphoneIcon, ChatIcon, MailIcon, BellIcon } from './icons';
import AlertsDropdown from './AlertsDropdown';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    loggedInUser: User | null;
    onSignOut: () => void;
    alerts: Alert[];
    onAlertClick: (alert: Alert) => void;
}

const NavButton: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children, icon }) => {
    const isActive = currentPage === page;
    const baseClasses = "px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform flex items-center justify-center gap-2";
    const activeClasses = "bg-blue-600 ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-800 shadow-lg scale-105";
    const inactiveClasses = "bg-gray-700 hover:bg-gray-600 hover:scale-105";

    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span>{children}</span>
            {isActive && <span className="hidden md:inline"> (You're on this Page)</span>}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, loggedInUser, onSignOut, alerts, onAlertClick }) => {
    const baseButtonClasses = "px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform bg-gray-700 hover:bg-gray-600 hover:scale-105";
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);
    const alertsRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
                setIsAlertsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    {loggedInUser && (
                         <NavButton page={Page.Softphone} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<SoftphoneIcon />}>
                            Softphone
                        </NavButton>
                    )}
                    {loggedInUser && loggedInUser.chat_enabled && (
                        <NavButton page={Page.Chat} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<ChatIcon />}>
                            Chat
                        </NavButton>
                    )}
                     {loggedInUser && loggedInUser.localmail_enabled && (
                        <NavButton page={Page.LocalMail} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<MailIcon />}>
                            LocalMail
                        </NavButton>
                    )}
                    <a 
                        href="https://sites.google.com/gcp.lynixity.x10.bz/myportal/home" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={baseButtonClasses}
                    >
                        MyPortal
                    </a>
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
                             <div className="relative" ref={alertsRef}>
                                <button onClick={() => setIsAlertsOpen(prev => !prev)} className="relative p-2 text-gray-300 hover:text-white transition">
                                    <BellIcon />
                                    {alerts.length > 0 && (
                                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {alerts.length}
                                        </span>
                                    )}
                                </button>
                                {isAlertsOpen && <AlertsDropdown alerts={alerts} onAlertClick={onAlertClick} onClose={() => setIsAlertsOpen(false)} />}
                            </div>
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