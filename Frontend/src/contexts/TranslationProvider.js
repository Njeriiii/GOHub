import { createContext, useContext, useState } from 'react';
import { STATIC_PHRASES } from '../components/utils/translationConstants';

const TranslationContext = createContext();

// Static content translation component - uses STATIC_PHRASES
export function Translate({ children }) {
    const { currentLanguage } = useContext(TranslationContext);
    
    if (typeof children !== 'string') {
        return children;
    }

    const translation = STATIC_PHRASES[currentLanguage]?.[children] || children;
    return translation;
}

// Dynamic content translation component - will use backend translation API
export function DynamicTranslate({ children }) {
    const { currentLanguage } = useContext(TranslationContext);
    
    // Early return for English or non-string content
    if (currentLanguage === 'en' || !children || typeof children !== 'string') {
        return children;
    }

    // TODO: Will integrate with backend translation API
    // For now, marking dynamic content by returning it unchanged
    return children;
}

export default function TranslationProvider({ children }) {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isLoading, setIsLoading] = useState(false);

    const contextValue = {
        currentLanguage,
        setCurrentLanguage,
        isLoading
    };

    return (
        <TranslationContext.Provider value={contextValue}>
            {children}
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => {
                        setIsLoading(true);
                        setCurrentLanguage(currentLanguage === 'en' ? 'sw' : 'en');
                        setTimeout(() => setIsLoading(false), 100);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? 'Translating...' : 
                        currentLanguage === 'en' ? 'Switch to Swahili' : 'Switch to English'}
                </button>
            </div>
        </TranslationContext.Provider>
    );
}

// Custom hook for translations
export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    
    return {
        currentLanguage: context.currentLanguage,
        setLanguage: context.setCurrentLanguage,
        isLoading: context.isLoading
    };
}
