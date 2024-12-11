import { createContext, useContext, useState, useEffect } from 'react';
import { STATIC_PHRASES } from '../components/utils/translationConstants';

const TranslationContext = createContext();

// Static content translation component
export function Translate({ children }) {
    const { currentLanguage } = useContext(TranslationContext);
    
    if (typeof children !== 'string') {
        return children;
    }

    const translation = STATIC_PHRASES[currentLanguage]?.[children] || children;
    return translation;
}

// Dynamic content translation component
export function DynamicTranslate({ children }) {
    const { currentLanguage } = useContext(TranslationContext);
    
    if (currentLanguage === 'en' || !children || typeof children !== 'string') {
        return children;
    }
    
    return children; // TODO: Will integrate with backend translation API
}

export default function TranslationProvider({ children }) {
    // Get initial language from localStorage, default to 'en' if not found
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem('preferredLanguage') || 'en';
    });
    const [isLoading, setIsLoading] = useState(false);

    // Update localStorage whenever language changes
    useEffect(() => {
        localStorage.setItem('preferredLanguage', currentLanguage);
    }, [currentLanguage]);

    const handleLanguageChange = () => {
        setIsLoading(true);
        const newLanguage = currentLanguage === 'en' ? 'sw' : 'en';
        setCurrentLanguage(newLanguage);
        setTimeout(() => setIsLoading(false), 100);
    };

    const contextValue = {
        currentLanguage,
        setCurrentLanguage,
        isLoading
    };

    return (
        <TranslationContext.Provider value={contextValue}>
            {children}
            <button
                onClick={handleLanguageChange}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isLoading}
            >
                {isLoading ? 'Translating...' : currentLanguage === 'en' ? 'Switch to Swahili' : 'Switch to English'}
            </button>
        </TranslationContext.Provider>
    );
}

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
