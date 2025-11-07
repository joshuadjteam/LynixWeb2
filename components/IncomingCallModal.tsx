import React from 'react';
import { Call } from '../types';
import { PhoneIcon } from './icons';

interface IncomingCallModalProps {
    call: Call;
    onAnswer: () => void;
    onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ call, onAnswer, onDecline }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] p-4 animate-modal-open">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center relative text-gray-800 dark:text-white p-8">
                <div className="flex items-center gap-4 mb-4">
                    <PhoneIcon />
                    <h3 className="text-2xl font-bold">Incoming Call</h3>
                </div>
                <p className="text-lg mb-8">
                    Call from <span className="font-bold">{call.caller_username}</span>
                </p>
                <div className="flex w-full justify-around">
                    <button
                        onClick={onDecline}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition transform hover:scale-105"
                    >
                        Decline
                    </button>
                    <button
                        onClick={onAnswer}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition transform hover:scale-105"
                    >
                        Answer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;