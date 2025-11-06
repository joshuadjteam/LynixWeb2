
import React from 'react';
import Clock from './Clock';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white p-6">
            <div className="w-full max-w-4xl bg-black bg-opacity-30 p-8 rounded-xl shadow-2xl border-2 border-purple-500/50 backdrop-blur-sm">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Welcome to Lynix by DJTeam!</h2>
                <p className="text-base md:text-lg text-left leading-relaxed">
                    Welcome to Lynix, where innovation in technology and coding comes to life. Since our inception in January 2024, we've been dedicated to pushing the boundaries of web development. We launched our first suite of products in July 2024 and began sharing our journey on our YouTube channel, '@DarCodr'. Today, our primary mission remains rooted in creating powerful coding solutions, while expanding our services to include reliable email support, crystal-clear SIP Voice communication, and more. Explore what we have to offer.
                </p>
                <Clock />
            </div>
        </div>
    );
};

export default HomePage;
