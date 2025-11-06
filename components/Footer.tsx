import React from 'react';
import { YouTubeIcon, TikTokIcon, InstagramIcon, QuestionMarkIcon } from './icons';

interface FooterProps {
    onOpenAiChoiceModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenAiChoiceModal }) => {
    return (
        <>
            <footer className="bg-gray-800 bg-opacity-70 backdrop-blur-sm text-white p-4 mt-auto">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center">
                    <p className="text-gray-400">&copy; 2025 Lynix Technology and Coding. All Rights Reserved.</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <a href="https://www.youtube.com/@DarCodr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><YouTubeIcon /></a>
                        <a href="https://www.tiktok.com/@darcodr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><TikTokIcon /></a>
                        <a href="https://www.instagram.com/dar_codr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><InstagramIcon /></a>
                    </div>
                </div>
            </footer>
             <button
                onClick={onOpenAiChoiceModal}
                className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 z-50 animate-ai-pulse"
                aria-label="Open AI Assistant"
            >
                <QuestionMarkIcon />
            </button>
        </>
    );
};

export default Footer;