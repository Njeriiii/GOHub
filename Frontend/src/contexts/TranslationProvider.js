import { useState, createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useApi } from '../contexts/ApiProvider';

export const TranslationContext = createContext();

function AutoTranslate({ children }) {
    console.log('1. AutoTranslate initialized');
    const { translateText, isSwahili } = useContext(TranslationContext);
    const containerRef = useRef(null);
    const originalContent = useRef(null);
    const isProcessing = useRef(false);

    useEffect(() => {
        console.log('2. useEffect triggered', { isSwahili });
        
        // Prevent concurrent processing
        if (isProcessing.current) {
            console.log('2a. Already processing, skipping');
            return;
        }

        // Store original content on first render
        if (!originalContent.current && containerRef.current) {
            console.log('3. Storing original content');
            originalContent.current = containerRef.current.cloneNode(true);
        }

        const translateNode = async () => {
            if (!containerRef.current) return;
            isProcessing.current = true;

            try {
                // Handle switch back to English
                if (!isSwahili) {
                    console.log('4. Switching back to English');
                    if (originalContent.current) {
                        containerRef.current.innerHTML = originalContent.current.innerHTML;
                    }
                    return;
                }

                console.log('5. Starting batch translation process');

                // Create TreeWalker to find all text nodes
                const walker = document.createTreeWalker(
                    containerRef.current,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: (node) => {
                            const shouldAccept = node.textContent.trim() 
                                ? NodeFilter.FILTER_ACCEPT 
                                : NodeFilter.FILTER_REJECT;
                            console.log('5a. Evaluating node:', {
                                text: node.textContent,
                                accepted: shouldAccept === NodeFilter.FILTER_ACCEPT
                            });
                            return shouldAccept;
                        }
                    }
                );

                // Collect all text nodes and their content
                const textNodes = [];
                const textsToTranslate = [];
                let node;
                while (node = walker.nextNode()) {
                    const text = node.textContent.trim();
                    if (text) {
                        textNodes.push(node);
                        textsToTranslate.push(text);
                    }
                }

                console.log('6. Found nodes to translate:', textsToTranslate.length);

                if (textsToTranslate.length > 0) {
                    console.log('7. Starting parallel translations');
                    // Translate all texts in parallel
                    const translations = await Promise.all(
                        textsToTranslate.map(text => {
                            console.log('7a. Queuing translation for:', text);
                            return translateText(text);
                        })
                    );
                    
                    console.log('8. Applying translations to DOM');
                    // Apply all translations at once
                    textNodes.forEach((node, index) => {
                        console.log('8a. Updating node:', {
                            original: node.textContent,
                            translated: translations[index]
                        });
                        node.textContent = translations[index];
                    });
                }

                console.log('9. Batch translation complete');
            } finally {
                isProcessing.current = false;
            }
        };

        translateNode();
    }, [isSwahili]); // Only re-run when language changes

    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
}

export default function TranslationProvider({ children }) {
    console.log('0. TranslationProvider initialized');
    const [isSwahili, setIsSwahili] = useState(false);
    const [translations, setTranslations] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const apiClient = useApi();

    // Memoized translation function
    const translateText = useCallback(async (text) => {
        console.log('10. translateText called with:', text);
        if (!text?.trim()) return text;
        
        // Check cache first
        if (translations.has(text)) {
            console.log('10a. Cache hit for:', text);
            return translations.get(text);
        }

        try {
            console.log('10b. Making API request for:', text);
            const response = await apiClient.post('/main/translate', {
                text: text,
                target_language: 'sw'
            });
            
            if (response?.body?.translated_text) {
                const translated = response.body.translated_text;
                console.log('10c. Translation received:', translated);
                setTranslations(prev => new Map(prev).set(text, translated));
                return translated;
            }
            console.log('10d. No translation received, returning original');
            return text;
        } catch (error) {
            console.error('10e. Translation error:', error);
            return text;
        }
    }, [apiClient]); // Only recreate if apiClient changes

    // Handle loading state updates
    const updateLoadingState = useCallback((loading) => {
        setIsLoading(loading);
    }, []);

    return (
        <TranslationContext.Provider value={{ isSwahili, setIsSwahili, translateText, isLoading }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={async () => {
                        console.log('Button clicked, current state:', isSwahili);
                        updateLoadingState(true);
                        setIsSwahili(!isSwahili);
                        // Brief delay to allow translations to complete
                        setTimeout(() => updateLoadingState(false), 100);
                    }}
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
    console.log('1. TranslatedContent rendered');
    return <AutoTranslate>{children}</AutoTranslate>;
}
