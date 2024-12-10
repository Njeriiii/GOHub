import { useState, createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { STATIC_PHRASES } from '../components/utils/translationConstants';

console.log('0. Initializing translation system');
console.log('1. Static phrases loaded:', Object.keys(STATIC_PHRASES.sw).length, 'phrases');

export const TranslationContext = createContext();

function AutoTranslate({ children }) {
    console.log('2. AutoTranslate component initialized');
    const { currentLanguage, translateText } = useContext(TranslationContext);
    const containerRef = useRef(null);
    const originalContent = useRef(null);
    const isProcessing = useRef(false);
    const currentPath = window.location.pathname;
    const renderTimeout = useRef(null);

    // Reset originalContent when path changes
    useEffect(() => {
        console.log('2a. Path changed, resetting original content');
        originalContent.current = null;

        // Clear any pending render timeout
        if (renderTimeout.current) {
            clearTimeout(renderTimeout.current);
        }
    }, [currentPath]);

    useEffect(() => {
        console.log('3. AutoTranslate useEffect triggered', { currentLanguage });
        
        if (isProcessing.current) {
            console.log('4. Translation already in progress, skipping');
            return;
        }

        // Wait for React to finish rendering
        renderTimeout.current = setTimeout(() => {

            const processNode = async () => {
            console.log('6. Starting processNode function');
            if (!containerRef.current) {
                console.log('7. No container ref found, aborting');
                return;
            }

            // Check if container has actual content
            const hasContent = containerRef.current.textContent.trim().length > 0;
            if (!hasContent) {
                console.log('7a. Container has no content yet, waiting...');
                return;
            }
            
            isProcessing.current = true;
            console.log('8. Set processing flag to true');

            try {
                // Verify DOM is ready
                const verifyDomContent = () => {
                    const textNodes = [];
                    const walker = document.createTreeWalker(
                        containerRef.current,
                        NodeFilter.SHOW_TEXT,
                        null
                    );
                    let node;
                    while (node = walker.nextNode()) {
                        if (node.textContent.trim()) {
                            textNodes.push(node);
                        }
                    }
                    return textNodes.length > 0;
                };

                if (!verifyDomContent()) {
                    console.log('8a. DOM content not ready, waiting...');
                    return;
                }

                // Store original content - Now checks if we're in English
                if (!originalContent.current && currentLanguage === 'en') {
                    console.log('9. Storing original content for first time');
                    originalContent.current = containerRef.current.cloneNode(true);
                } else if (!originalContent.current) {
                    // If we don't have original content and we're not in English,
                    // we need to wait for a switch to English to store it
                    console.log('9a. Waiting for English content before storing original');
                }

                // Clean up any previous translations
                console.log('9a. Cleaning up previous translations');
                const cleanup = () => {
                    const walker = document.createTreeWalker(
                        containerRef.current,
                        NodeFilter.SHOW_TEXT,
                        null
                    );

                    let node;
                    while (node = walker.nextNode()) {
                        delete node.translated;
                        delete node.originalText;
                    }
                };
                cleanup();

            // Handle English switch - MOVED this check here
            if (currentLanguage === 'en') {
                console.log('10. Switching back to English');
                if (originalContent.current) {

                    // Reset all translation flags in current content
                    const allNodes = containerRef.current.getElementsByTagName('*');
                    Array.from(allNodes).forEach(node => {
                        delete node.translated;
                    });

                    // Create a walker for both current and original content
                    console.log('10a. Creating walkers for content restoration');
                    const walker = document.createTreeWalker(
                        containerRef.current,
                        NodeFilter.SHOW_TEXT,
                        {
                            acceptNode: (node) => {
                                const parent = node.parentElement;
                                if (parent && (
                                    parent.hasAttribute('data-no-translate') ||
                                    parent.tagName === 'SCRIPT' ||
                                    parent.tagName === 'STYLE' ||
                                    parent.tagName === 'INPUT' ||
                                    parent.tagName === 'TEXTAREA'
                                )) {
                                    return NodeFilter.FILTER_REJECT;
                                }
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                    );

                    const originalWalker = document.createTreeWalker(
                        originalContent.current,
                        NodeFilter.SHOW_TEXT,
                        {
                            acceptNode: (node) => node.textContent.trim() ? 
                                NodeFilter.FILTER_ACCEPT : 
                                NodeFilter.FILTER_REJECT
                        }
                    );

                    console.log('10b. Starting content restoration');
                    let currentNode = walker.nextNode();
                    let originalNode = originalWalker.nextNode();

                    while (currentNode && originalNode) {
                        if (currentNode.textContent !== originalNode.textContent) {
                            console.log('10c. Restoring node:', {
                                from: currentNode.textContent.substring(0, 20) + (currentNode.textContent.length > 20 ? '...' : ''),
                                to: originalNode.textContent.substring(0, 20) + (originalNode.textContent.length > 20 ? '...' : '')
                            });
                            currentNode.textContent = originalNode.textContent;
                        }
                        currentNode = walker.nextNode();
                        originalNode = originalWalker.nextNode();
                    }
                    
                    // Also restore placeholders when switching to English
                    console.log('10d. Restoring placeholders');
                    containerRef.current.querySelectorAll('input[placeholder]').forEach(input => {
                        console.log('10e. Processing input with placeholder:', input.placeholder);
                        // Find all inputs in original content and print them
                        const allOriginalInputs = originalContent.current.querySelectorAll('input[placeholder]');
                        console.log('10f. Original inputs found:', Array.from(allOriginalInputs).map(i => i.placeholder));
                        
                        // Try to find matching input by both placeholder and some other attribute if possible
                        // For example, if inputs have name, class, or id attributes
                        const originalInput = Array.from(allOriginalInputs).find(orig => {
                            const sameClass = orig.className === input.className;
                            const sameName = orig.name === input.name;
                            const sameId = orig.id === input.id;
                            console.log('10g. Comparing input:', {
                                current: input.placeholder,
                                original: orig.placeholder,
                                sameClass,
                                sameName,
                                sameId
                            });
                            return sameClass || sameName || sameId;
                        });

                        if (originalInput) {
                            console.log('10h. Found matching input, restoring placeholder from:', originalInput.placeholder, 'to:', input.placeholder);
                            input.placeholder = originalInput.placeholder;
                            input.translated = false; // Reset translated flag
                        } else {
                            console.log('10i. No matching input found for:', input.placeholder);
                        }
                    });
                    
                    console.log('11. Restored original English content');
                    }
                    isProcessing.current = false;
                    console.log('returning');
                    return;
                }

                // Handle placeholders separately
                const inputs = containerRef.current.querySelectorAll('input[placeholder]');
                inputs.forEach(async input => {
                    const placeholder = input.placeholder;
                    if (placeholder && !input.translated) {
                        console.log('Processing placeholder:', placeholder);
                        const staticTranslation = STATIC_PHRASES[currentLanguage]?.[placeholder];
                        const translatedPlaceholder = staticTranslation || await translateText(placeholder);
                        input.placeholder = translatedPlaceholder;
                        input.translated = true;
                    }
                });

                console.log('12. Creating TreeWalker for text nodes');
                const walker = document.createTreeWalker(
                containerRef.current,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                    const text = node.textContent.trim();
                    const parent = node.parentElement;
                    const skipNode = !text || 
                                    (parent && (
                                    parent.hasAttribute('data-no-translate') ||
                                    parent.tagName === 'SCRIPT' ||
                                    parent.tagName === 'STYLE' ||
                                    parent.tagName === 'INPUT' ||
                                    parent.tagName === 'TEXTAREA'
                                    ));
                    
                    console.log('13. Evaluating node:', {
                        text: text.substring(0, 20) + (text.length > 20 ? '...' : ''),
                        skip: skipNode,
                        reason: skipNode ? 'Empty/Excluded element' : 'Accepted'
                    });
                    
                    return skipNode ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
                    }
                }
                );

                console.log('14. Beginning node collection');
                const nodes = [];
                const texts = [];
                let node;
                
                while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                if (text) {
                    nodes.push(node);
                    texts.push(text);
                    console.log('15. Collected node:', {
                    text: text.substring(0, 20) + (text.length > 20 ? '...' : ''),
                    nodeIndex: nodes.length - 1
                    });
                    }
                }

                console.log('16. Total nodes collected:', nodes.length);
                console.log('16. Total texts collected:', texts);

                const BATCH_SIZE = 10;
                console.log('17. Processing in batches of', BATCH_SIZE);

                for (let i = 0; i < texts.length; i += BATCH_SIZE) {
                    const batch = texts.slice(i, i + BATCH_SIZE);
                    const batchNodes = nodes.slice(i, i + BATCH_SIZE);
                    
                    console.log('18. Processing batch', Math.floor(i / BATCH_SIZE) + 1, 'of', Math.ceil(texts.length / BATCH_SIZE));

                    const translations = await Promise.all(
                        batch.map(async (text) => {
                        console.log('19. Checking static translation for:', text.substring(0, 20) + (text.length > 20 ? '...' : ''));
                        const staticTranslation = STATIC_PHRASES[currentLanguage]?.[text];
                        console.log('19a. Static translation check:', {
                            text,
                            currentLanguage,
                            hasTranslation: !!staticTranslation,
                            translation: staticTranslation
                        });
                        
                        if (staticTranslation) {
                            console.log('20. Found static translation');
                            return staticTranslation;
                        }

                        console.log('21. No static translation, using API');
                        return translateText(text);
                        })
                    );

                    console.log('22. Applying translations for batch');

                    // In your node processing loop:
                    batchNodes.forEach((node, index) => {
                        console.log('23. Updating node', i + index, ':', {
                            original: node.textContent.substring(0, 20) + (node.textContent.length > 20 ? '...' : ''),
                            translated: translations[index].substring(0, 20) + (translations[index].length > 20 ? '...' : ''),
                            fullOriginal: node.textContent,
                            fullTranslated: translations[index]
                        });
                        
                        // Store original text if not already stored
                        if (!node.originalText) {
                            node.originalText = node.textContent;
                        }
                        
                        node.textContent = translations[index];
                    });
                    
                    // Add after the forEach
                    console.log('22a. Checking for potential text carryover:', {
                        processedNodes: batchNodes.map(node => ({
                            text: node.textContent,
                            originalText: node.originalText,
                            parentElement: node.parentElement?.tagName
                        }))
                    });
                }

                console.log('24. All batches processed successfully');
            } catch (error) {
                console.error('25. Error during translation:', error);
            } finally {
                console.log('26. Setting processing flag to false');
                isProcessing.current = false;
            }
            };

            processNode();
        }, 100);  // Small delay to ensure React rendering is complete

        // Cleanup
        return () => {
            if (renderTimeout.current) {
                clearTimeout(renderTimeout.current);
            }
        };
    }, [currentLanguage, translateText, currentPath]);

    return (
        <div ref={containerRef} className="translation-container">
        {children}
        </div>
    );
}

export default function TranslationProvider({ children }) {
    console.log('27. TranslationProvider initialized');
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [translations] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const apiClient = useApi();

    console.log('isLoading', isLoading);

    const translateText = useCallback(async (text) => {
        console.log('text to translate:', text);
        console.log('28. translateText called with:', text.substring(0, 20) + (text.length > 20 ? '...' : ''));
    
        if (!text?.trim() || currentLanguage === 'en') {
            console.log('29. No translation needed (empty text or English)');
            return text;
        }
        
        const cacheKey = `${currentLanguage}:${text}`;
        if (translations.has(cacheKey)) {
            console.log('30. Found in cache');
            return translations.get(cacheKey);
        }

        try {
            console.log('31. Making API request');
            console.log('isLoading', isLoading);
            // const response = await apiClient.post('/main/translate', {
            //     text,
            //     target_language: currentLanguage
            // });
            
            // if (response?.body?.translated_text) {
            //     const translated = response.body.translated_text;
            //     console.log('32. Received translation:', translated.substring(0, 20) + (translated.length > 20 ? '...' : ''));
            //     translations.set(cacheKey, translated);
            //     return translated;
            // }
            
            console.log('33. No translation received, returning original');
            return text;
            } catch (error) {
            console.error('34. Translation API error:', error);
            return text;
            }
    }, [apiClient, currentLanguage, translations]);

    console.log('35. Rendering TranslationProvider');
    return (
    <TranslationContext.Provider value={{ currentLanguage, setCurrentLanguage, translateText, isLoading }}>
        <AutoTranslate>{children}</AutoTranslate>
        <div className="fixed bottom-4 right-4 z-50">
            <button
            onClick={() => {
                console.log('36. Language switch button clicked');
                setIsLoading(true);
                setCurrentLanguage(currentLanguage === 'en' ? 'sw' : 'en');
                setTimeout(() => {
                console.log('37. Translation loading complete');
                setIsLoading(false);
                }, 100);
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

export function TranslatedContent({ children }) {
    console.log('38. TranslatedContent rendered');
    return children;
}
