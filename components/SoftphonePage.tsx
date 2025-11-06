import React from 'react';

const SoftphonePage: React.FC = () => {
  return (
    <div className="w-full max-w-7xl h-[80vh] mx-auto bg-black bg-opacity-30 p-4 sm:p-8 rounded-xl shadow-2xl border-2 border-purple-500/50 backdrop-blur-sm text-white flex flex-col">
      <div className="mb-4">
        <h2 className="text-3xl font-bold">Web Softphone</h2>
        <p className="text-gray-300">
          Enter your SIP credentials below to register and start making calls.
          You may need to allow microphone permissions in your browser.
        </p>
      </div>
      <iframe
        src="https://tryit.jssip.net/"
        className="w-full h-full border-0 rounded-lg"
        title="JsSIP Softphone Client"
        allow="microphone"
      ></iframe>
    </div>
  );
};

export default SoftphonePage;
