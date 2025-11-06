import React from 'react';

const SoftphonePage: React.FC = () => {
    return (
        <div className="w-full h-[80vh] max-w-7xl mx-auto bg-black bg-opacity-30 p-4 sm:p-6 rounded-xl shadow-2xl border-2 border-purple-500/50 backdrop-blur-sm text-white flex flex-col">
            <div className="mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Web Softphone</h2>
                <p className="text-center text-gray-300 mt-2">
                    Enter your SIP credentials into the client below to connect and make calls.
                </p>
            </div>
            <div className="flex-grow w-full h-full rounded-lg overflow-hidden">
                <iframe
                    src="https://tryit.iptel.org/"
                    className="w-full h-full border-0"
                    title="JsSIP Softphone Client"
                    allow="microphone"
                ></iframe>
            </div>
        </div>
    );
};

export default SoftphonePage;
