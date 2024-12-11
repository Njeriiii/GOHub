import { createContext, useContext, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
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

export function LanguageSwitch() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('LanguageSwitch must be used within a TranslationProvider');
    }

    const { currentLanguage, setCurrentLanguage } = context;
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (newLanguage) => {
        if (newLanguage === currentLanguage) return;
        
        setIsLoading(true);
        setCurrentLanguage(newLanguage);
        setIsOpen(false);
        setTimeout(() => setIsLoading(false), 100);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Change Language"
            >
                <Globe className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''} text-gray-600`} />
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 py-1 w-32 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                                currentLanguage === 'en' 
                                    ? 'bg-teal-50 text-teal-600' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => handleLanguageChange('sw')}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                                currentLanguage === 'sw' 
                                    ? 'bg-teal-50 text-teal-600' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Kiswahili
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function TranslationProvider({ children }) {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem('preferredLanguage') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('preferredLanguage', currentLanguage);
    }, [currentLanguage]);

    const contextValue = {
        currentLanguage,
        setCurrentLanguage
    };

    return (
        <TranslationContext.Provider value={contextValue}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}
