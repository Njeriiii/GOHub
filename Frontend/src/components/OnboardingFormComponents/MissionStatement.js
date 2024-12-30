import React, { useState, useEffect, useRef } from 'react';

const MissionStatement = ({ initialValue = '', onChange }) => {
    const [statement, setStatement] = useState(initialValue);
    const [charCount, setCharCount] = useState(initialValue.length);
    const textAreaRef = useRef(null);

    useEffect(() => {
        setStatement(initialValue);
        setCharCount(initialValue.length);
    }, [initialValue]);

    const adjustTextAreaHeight = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            // Reset height to auto to get the correct scrollHeight
            textArea.style.height = 'auto';
            // Set new height based on scrollHeight
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };

    // Adjust height on content change
    useEffect(() => {
        adjustTextAreaHeight();
    }, [statement]);

    // Adjust height on window resize
    useEffect(() => {
        window.addEventListener('resize', adjustTextAreaHeight);
        return () => window.removeEventListener('resize', adjustTextAreaHeight);
    }, []);

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setStatement(newValue);
        setCharCount(newValue.length);
        onChange(newValue);
    };

    return (
        <div className="relative">
            <textarea
                ref={textAreaRef}
                value={statement}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 
                        focus:ring-teal-500 sm:text-base min-h-[100px] transition-height duration-200"
                placeholder="Enter your organization's mission statement..."
                style={{ resize: 'none', overflow: 'hidden' }}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                {charCount} characters
            </div>
        </div>
    );
};

export default MissionStatement;