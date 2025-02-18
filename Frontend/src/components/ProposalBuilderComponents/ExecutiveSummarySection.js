import React, { useState, useEffect } from 'react';
import { 
    DocumentTextIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useApi } from '../../contexts/ApiProvider';
import { useAuth } from '../../contexts/AuthProvider';
import GeneratedContent from './GeneratedContent';

/**
 * ExecutiveSummarySection
 * 
 * Creates a compelling executive summary that synthesizes all proposal sections.
 * Written last but appears first in the final document.
 * Pulls context from organization info, project narrative, and budget sections.
 */
export default function ExecutiveSummarySection() {
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const apiClient = useApi();
    const { user } = useAuth();
    const userId = user ? user.id : null;

    const [inputs, setInputs] = useState({
        keyHighlights: '', // Additional points to emphasize
        uniqueValue: '', // What makes this project special
        urgency: '', // Why now/why this project
        impact: '' // Expected outcomes worth highlighting
    });

    // Load stored content from localStorage on mount
    useEffect(() => {
        const storedContent = localStorage.getItem(`${userId}_executiveSummary`);
        if (storedContent) {
            setGeneratedContent(storedContent);
        }
    }, []);

    const handleInputChange = (field, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Get content from all previous sections
            const orgContent = localStorage.getItem(`${userId}_organizationContent`);
            const narrativeContent = localStorage.getItem(`${userId}_projectNarrative`);
            const budgetContent = localStorage.getItem(`${userId}_proposalBudget`);

            const prompt = `You are an expert grant writer. Create a compelling executive summary that synthesizes all sections of the grant proposal into a powerful opening statement. 
            
            Use these sections for context:
            
            Organization Information:
            ${orgContent}

            Project Narrative:
            ${narrativeContent}

            Budget Information:
            ${budgetContent}

            Additional Emphasis Points:
            Key Highlights: ${inputs.keyHighlights}
            Unique Value: ${inputs.uniqueValue}
            Urgency: ${inputs.urgency}
            Impact: ${inputs.impact}

            Create an executive summary that:
            1. Captures attention in the first paragraph
            2. Clearly states the problem and your solution
            3. Emphasizes your organization's unique capability
            4. Includes key financial figures and project timeline
            5. Highlights expected impact and outcomes
            6. Maintains professional tone while conveying urgency
            7. Stays under 500 words
            
            Note: This summary will appear first in the proposal but synthesizes all sections.`;

            const response = await apiClient.post('/claude/generate', {
                prompt,
                section: 'executiveSummary'
            });

            setGeneratedContent(response.body.content);
            localStorage.setItem(`${userId}_executiveSummary`, response.body.content);

            
        } catch (error) {
            console.error('Generation failed:', error);
            setError('Failed to generate executive summary. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>

            {/* Information Notice */}
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-normal">
                    <ul className="list-disc list-inside">
                        <li><span className="font-bold">This is your opening pitch</span> - make every word count.</li>
                        <li><span className="font-bold">Write this section last</span> but present it first in your proposal.</li>
                        <li><span className="font-bold">Focus on key points</span> from each section of your proposal.</li>
                        <li><span className="font-bold">Keep it concise</span> - aim for 500 words or less.</li>
                        <li>Remember: Many readers will only see this section.</li>
                    </ul>
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    <span className="font-bold">Note:</span> Before generating the executive summary, make sure you've completed all other sections of your proposal. The AI will use that context to create a comprehensive summary.
                </p>
            </div>

            {/* Input Form */}
            <div className="space-y-6">
                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Key Points to Emphasize
                    </label>
                    <textarea
                        value={inputs.keyHighlights}
                        onChange={(e) => handleInputChange('keyHighlights', e.target.value)}
                        placeholder="What are the most important points that should stand out?"
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Unique Value Proposition
                    </label>
                    <textarea
                        value={inputs.uniqueValue}
                        onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                        placeholder="What makes your organization/project uniquely qualified to address this need?"
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Urgency and Timing
                    </label>
                    <textarea
                        value={inputs.urgency}
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                        placeholder="Why is this project critical now? What makes the timing important?"
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Impact Highlights
                    </label>
                    <textarea
                        value={inputs.impact}
                        onChange={(e) => handleInputChange('impact', e.target.value)}
                        placeholder="What are the most compelling outcomes and impacts to highlight?"
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
                {isGenerating ? (
                    <>
                        <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                        Generating...
                    </>
                ) : (
                    <>
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Generate Executive Summary
                    </>
                )}
            </button>

            {/* Display generated content */}
            {generatedContent && (
                <GeneratedContent 
                    content={generatedContent}
                    onRegenerate={handleGenerate}
                />
            )}
        </div>
    );
}