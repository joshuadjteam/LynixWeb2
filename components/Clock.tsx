
import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="text-center text-lg md:text-xl font-mono mt-8">
            <p>The Time is {formatTime(date)} / {formatDate(date)}</p>
        </div>
    );
};

export default Clock;
