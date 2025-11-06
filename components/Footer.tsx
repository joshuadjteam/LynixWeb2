import React from 'react';
import { YouTubeIcon, TikTokIcon, InstagramIcon } from './icons';

const Footer: React.FC = () => {
    return (
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
    );
};

export default Footer;