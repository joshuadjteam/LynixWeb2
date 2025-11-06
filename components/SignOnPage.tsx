import React, { useState } from 'react';
import { User } from '../types';
import { authenticateUser } from '../data/users';

interface SignOnPageProps {
    onLoginSuccess: (user: User) => void;
}

const SignOnPage: React.FC<SignOnPageProps> = ({ onLoginSuccess }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = authenticateUser(login, password);

        if (user) {
            onLoginSuccess(user);
        } else {
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-white p-6">
            <div className="w-full max-w-md bg-black bg-opacity-30 p-8 rounded-xl shadow-2xl border-2 border-purple-500/50 backdrop-blur-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Access Your Lynix Account</h2>
                <p className="text-center text-gray-200 mb-8">
                    Sign in using your Phone Number, TalkID, Email, or Admin ID to continue.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="login" className="w-20 text-right font-semibold">Login :</label>
                        <input
                            id="login"
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="flex-1 bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                            placeholder="Enter your ID"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="password" className="w-20 text-right font-semibold">Passwd :</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                            placeholder="Enter your password"
                        />
                    </div>
                     <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignOnPage;
