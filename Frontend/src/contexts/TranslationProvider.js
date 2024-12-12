import { createContext, useContext, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { STATIC_PHRASES } from '../components/utils/translationConstants';
import { useApi } from './ApiProvider';

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
    const [translatedText, setTranslatedText] = useState(children);
    const apiClient = useApi();

    // Create a unique cache key
    const cacheKey = `translation_${children}_${currentLanguage}`;
    
    useEffect(() => {

        // Reset to original text when switching back to English
        if (currentLanguage === 'en') {
            setTranslatedText(children);
            return;
        }

        // Skip translation for non-string content
        if (!children || typeof children !== 'string') {
            return;
        }

        // Check local storage first
        const cachedTranslation = localStorage.getItem(cacheKey);
        console.log('Cached translation:', cachedTranslation);
        console.log('currentLanguage:', currentLanguage);
        console.log('cacheKey:', cacheKey);
        if (cachedTranslation) {
            setTranslatedText(cachedTranslation);
            console.log('used cached translation');
            return;
        }

        // Perform translation if not in cache
        const translateText = async () => {
            try {
                const response = await apiClient.post('/main/translate', {
                    text: children,
                    targetLanguage: currentLanguage
                });

                console.log('Translation response:', response);

                if (response.ok) {
                    setTranslatedText(response.body.translatedText.translatedText);

                    // Store in local storage
                    localStorage.setItem(cacheKey, response.body.translatedText.translatedText);
                }
            } catch (error) {
                console.error('Translation error:', error);
                // Fallback to original text if translation fails
                setTranslatedText(children);
            }
        };

        translateText();
    }, [children, currentLanguage, apiClient]);

    return translatedText;
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
