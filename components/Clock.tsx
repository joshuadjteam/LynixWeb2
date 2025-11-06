
import React from 'react';

const Clock: React.FC = () => {
    const staticDateTime = "The Time is 02:48 PM / Nov 6, 2025";

    return (
        <div className="text-center text-lg md:text-xl font-mono mt-8">
            <p>{staticDateTime}</p>
        </div>
    );
};

export default Clock;