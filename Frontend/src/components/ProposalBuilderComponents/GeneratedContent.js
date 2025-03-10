import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, DocumentDuplicateIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthProvider';

/**
 * GeneratedContent
 * 
 * A reusable component for displaying and managing AI-generated content.
 * Handles content display, copying, regeneration, and storage management.
 * 
 * @param {string} content - The content to display
 * @param {function} onRegenerate - Callback function to regenerate content
 * @param {string} storageKey - Key for localStorage (e.g., 'projectNarrative', 'executiveSummary')
 * @param {string} title - Optional custom title for the content section
 */
const GeneratedContent = ({ 
    content, 
    onRegenerate, 
    storageKey, 
    title = 'Generated Content'
}) => {
    const [copied, setCopied] = useState(false);
    const [localContent, setLocalContent] = useState('');
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const { user } = useAuth();
    const userId = user ? user.id : null;

    // Create full storage key with user ID if available
    const fullStorageKey = userId ? `${userId}_${storageKey}` : storageKey;

    // Load content from localStorage on mount and when content prop changes
    useEffect(() => {
        const storedContent = localStorage.getItem(fullStorageKey);
        setLocalContent(content || storedContent || '');
    }, [content, fullStorageKey]);

    // Format content with proper line breaks and spacing
    const formatContent = (text) => {
        if (!text) return null;
        
        const paragraphs = text.split('\n\n');
        return paragraphs.map((paragraph, index) => {
            const lines = paragraph.split('\n');
            return (
                <div key={index} className="mb-4">
                    {lines.map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < lines.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </div>
            );
        });
    };

    // Handle copying content to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(localContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            setShowAlert(true);
        }
    };

    // Handle regeneration of content
    const handleRegenerate = async () => {
        setIsRegenerating(true);
        try {
            await onRegenerate();
        } catch (error) {
            console.error('Regeneration failed:', error);
            setShowAlert(true);
        } finally {
            setIsRegenerating(false);
        }
    };

    // Clear content from localStorage
    const handleClear = () => {
        localStorage.removeItem(fullStorageKey);
        setLocalContent('');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    // Don't render if no content available
    if (!localContent) {
        return null;
    }

    return (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                </h3>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
                <div className="prose max-w-none">
                    {formatContent(localContent)}
                </div>
            </div>

            {/* Footer with actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                        >
                            <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                        </button>

                        <button
                            onClick={handleClear}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Clear Saved
                        </button>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        {copied ? (
                            <>
                                <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                                Copy to Clipboard
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneratedContent;