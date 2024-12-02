import { useState, createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useApi } from '../contexts/ApiProvider';

export const TranslationContext = createContext();

function AutoTranslate({ children }) {
    console.log('1. AutoTranslate component initialized');
    const { translateText, isSwahili } = useContext(TranslationContext);
    const containerRef = useRef(null);
    const originalContent = useRef(null);
    const isProcessing = useRef(false);

    useEffect(() => {
        console.log('2. AutoTranslate useEffect triggered', { isSwahili });

        if (isProcessing.current) {
            console.log('Already processing, skipping');
            return;
        }

        if (!originalContent.current && containerRef.current) {
            console.log('3. Storing original content');
            originalContent.current = containerRef.current.cloneNode(true);
        }

        const translateNode = async () => {
            if (!containerRef.current) return;
            isProcessing.current = true;

            try {
                if (!isSwahili) {
                    console.log('4. Switching to English, restoring original content');
                    if (originalContent.current) {
                        containerRef.current.innerHTML = originalContent.current.innerHTML;
                    }
                    return;
                }

                console.log('5. Creating TreeWalker');
                const walker = document.createTreeWalker(
                    containerRef.current,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: (node) => {
                            return node.textContent.trim() 
                                ? NodeFilter.FILTER_ACCEPT 
                                : NodeFilter.FILTER_REJECT;
                        }
                    }
                );

                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    textNodes.push(node);
                }
                console.log('6. Found text nodes:', textNodes.length);

                for (const textNode of textNodes) {
                    const originalText = textNode.textContent.trim();
                    if (originalText) {
                        const translatedText = await translateText(originalText);
                        if (translatedText !== originalText) {
                            textNode.textContent = translatedText;
                        }
                    }
                }
            } finally {
                isProcessing.current = false;
            }
        };

        translateNode();
    }, [isSwahili]); // Only depend on isSwahili state

    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
}

export default function TranslationProvider({ children }) {
    console.log('0. TranslationProvider rendered');
    const [isSwahili, setIsSwahili] = useState(false);
    const [translations, setTranslations] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const apiClient = useApi();

    const translateText = useCallback(async (text) => {
        if (!text?.trim()) return text;
        
        if (translations.has(text)) {
            return translations.get(text);
        }

        try {
            setIsLoading(true);
            
            const response = await apiClient.post('/main/translate', {
                text: text,
                target_language: 'sw'
            });

            console.log('Translation response:', response?.body);
            
            if (response?.body?.translated_text) {
                const translated = response.body.translated_text;
                console.log('Translation:', translated);
                setTranslations(prev => new Map(prev).set(text, translated));
                return translated;
            }
            return text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        } finally {
            setIsLoading(false);
        }
    }, [apiClient]);

    console.log(isLoading);
    console.log('translations:', translations);

    return (
        <TranslationContext.Provider value={{ isSwahili, setIsSwahili, translateText, isLoading }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsSwahili(!isSwahili)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? 'Translating...' : (isSwahili ? 'Show in English' : 'Show in Swahili')}
                </button>
            </div>
        </TranslationContext.Provider>
    );
}

export function TranslatedContent({ children }) {
    return <AutoTranslate>{children}</AutoTranslate>;
}