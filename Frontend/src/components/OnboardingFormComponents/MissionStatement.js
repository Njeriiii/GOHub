import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

const MissionStatement = forwardRef((props, ref) => {
    const [statement, setStatement] = useState('');
    const [charCount, setCharCount] = useState(0);
    const textAreaRef = useRef(null);

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
        setStatement(event.target.value);
        setCharCount(event.target.value.length);
    };

    const getData = () => {
        return statement;
    };

    useImperativeHandle(ref, () => ({ getData }));

    return (
        <div className="p-6">
            <div className="relative">
                <h2 className="text-xl font-medium mb-4 text-gray-900">Mission Statement</h2>
                
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
        </div>
    );
});

export default MissionStatement;