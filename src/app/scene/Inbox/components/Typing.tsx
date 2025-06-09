import React from "react";

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center space-x-1">
            <div className="relative bg-gray-200 px-3 py-4 rounded-2xl flex items-center">
                <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
                <div className={`absolute -z-1 -bottom-1 left-[-8px] opacity-[0.9] h-0 w-0 rotate-[50deg] border-l-[8px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-blue-500`} />
            </div>
        </div>
    );
};

export default TypingIndicator;