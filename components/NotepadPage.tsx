import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '../types';

interface NotepadPageProps {
    currentUser: User;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const NotepadPage: React.FC<NotepadPageProps> = ({ currentUser }) => {
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<SaveStatus>('idle');
    const saveTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch('/api/notepad', {
                    headers: { 'x-user-id': currentUser.id }
                });
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.content || '');
                } else {
                    console.error('Failed to fetch notes.');
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
                setStatus('error');
            }
        };
        fetchNotes();
    }, [currentUser.id]);

    const saveNote = useCallback(async (noteContent: string) => {
        setStatus('saving');
        try {
            const response = await fetch('/api/notepad', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': currentUser.id,
                },
                body: JSON.stringify({ content: noteContent }),
            });
            if (response.ok) {
                setStatus('saved');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error saving note:', error);
            setStatus('error');
        }
    }, [currentUser.id]);

    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        if (content !== null) { // Don't save on initial load
             setStatus('idle');
            saveTimeoutRef.current = window.setTimeout(() => {
                saveNote(content);
            }, 2000); // Auto-save after 2 seconds of inactivity
        }
    }, [content, saveNote]);

    const getStatusMessage = () => {
        switch (status) {
            case 'saving': return 'Saving...';
            case 'saved': return 'Saved';
            case 'error': return 'Error saving';
            default: return 'All changes will be saved automatically.';
        }
    };

    return (
        <div className="w-full h-[calc(100vh-150px)] max-w-7xl mx-auto bg-black bg-opacity-30 p-4 sm:p-6 rounded-xl shadow-2xl border-2 border-purple-500/50 backdrop-blur-sm text-white flex flex-col">
            <div className="mb-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Personal Notepad</h2>
                <p className="text-gray-300 mt-2">Your private space for quick notes and thoughts.</p>
            </div>
             <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 p-3 rounded-lg mb-4 text-center text-sm">
                <p><strong>Note:</strong> Your notes are private and secure. However, any notes not edited within 72 hours will be automatically cleared.</p>
            </div>
            <div className="flex-grow w-full h-full flex flex-col">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing here..."
                    className="w-full h-full bg-gray-900/50 text-white p-4 rounded-lg border-2 border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none text-lg leading-relaxed"
                />
                 <div className="text-right text-sm text-gray-400 mt-2 pr-1">
                    {getStatusMessage()}
                </div>
            </div>
        </div>
    );
};

export default NotepadPage;