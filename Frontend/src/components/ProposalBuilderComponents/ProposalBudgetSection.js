import React, { useState, useEffect } from 'react';
import { 
    CurrencyDollarIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useApi } from '../../contexts/ApiProvider';
import GeneratedContent from './GeneratedContent';

/**
 * ProposalBudgetSection
 * 
 * A flexible budget component that handles both specific grant requirements
 * and open-ended proposals. Adapts to different funding situations and
 * generates appropriate budget narratives.
 */
export default function ProposalBudgetSection() {
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const apiClient = useApi();

    // Initialize form state
    const [inputs, setInputs] = useState({
        grantType: 'open', // 'open' or 'specific'
        grantRequirements: '', // For pasting specific grant budget requirements
        budget: {
            totalAmount: '',
            breakdown: '', // Flexible text area for budget breakdown
            justification: '' // Explanation of costs
        },
        sustainability: {
            additionalFunding: '', // Other funding sources or plans
            continuationPlan: '' // How the project will continue after funding
        }
    });

    // Load stored content from localStorage on mount
    useEffect(() => {
        const storedContent = localStorage.getItem('proposalBudget');
        if (storedContent) {
            setGeneratedContent(storedContent);
        }
    }, []);

    const handleInputChange = (section, field, value) => {
        setInputs(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleGrandTypeChange = (type) => {
        setInputs(prev => ({
            ...prev,
            grantType: type
        }));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Get previous content for context
            const orgContent = localStorage.getItem('organizationContent');
            const narrativeContent = localStorage.getItem('projectNarrative');

            const prompt = `You are an expert grant writer. Using the provided information, create a budget narrative that ${
                inputs.grantType === 'specific' 
                ? 'addresses the specific grant requirements provided'
                : 'follows standard grant writing best practices'
            }.

            Organization Context:
            ${orgContent}

            Project Narrative Context:
            ${narrativeContent}

            ${inputs.grantType === 'specific' ? `Grant Requirements:
            ${inputs.grantRequirements}` : ''}

            Budget Information:
            Total Amount: ${inputs.budget.totalAmount}
            Budget Breakdown: ${inputs.budget.breakdown}
            Budget Justification: ${inputs.budget.justification}

            Additional Funding: ${inputs.sustainability.additionalFunding}
            Continuation Plan: ${inputs.sustainability.continuationPlan}

            Generate a professional budget narrative that:
            1. ${inputs.grantType === 'specific' ? 'Directly addresses the grant requirements' : 'Follows standard grant writing best practices'}
            2. Clearly justifies all costs
            3. Demonstrates fiscal responsibility
            4. Shows alignment with project goals
            5. Explains sustainability plans`;

            const response = await apiClient.post('/claude/generate', {
                prompt,
                section: 'proposalBudget'
            });

            setGeneratedContent(response.body.content);
            localStorage.setItem('proposalBudget', response.body.content);
            
        } catch (error) {
            console.error('Generation failed:', error);
            setError('Failed to generate budget narrative. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Budget</h2>

            {/* Grant Type Selection */}
            <div className="mb-8">
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-normal">
                        <ul className="list-disc list-inside">
                            <li><span className="font-bold">Be detailed and specific</span> with all cost estimates and line items.</li>
                            <li><span className="font-bold">Explain the rationale</span> behind each budget category and how it supports project goals.</li>
                            <li><span className="font-bold">Include all funding sources</span> and demonstrate responsible financial planning.</li>
                            <li><span className="font-bold">Show sustainability</span> by explaining how the project will continue beyond the grant period.</li>
                            <li>Use clear, professional language and accurate calculations.</li>
                        </ul>
                    </p>
                </div>

                <label className="block text-xl font-medium text-gray-700 mb-2">
                    Are you applying for a specific grant or creating an open proposal?
                </label>
                
                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Choose your approach:</h3>
                    <div className="space-y-3 text-gray-600">
                        <div>
                            <span className="font-semibold text-gray-900">Specific Grant:</span> Choose this if you're responding to a particular grant opportunity with defined requirements and guidelines. You'll be able to paste the grant's budget requirements and ensure your proposal aligns perfectly with the funder's expectations.
                        </div>
                        <div>
                            <span className="font-semibold text-gray-900">Open Proposal:</span> Select this if you're creating a general funding proposal or planning to approach multiple funders. This will help you create a flexible budget narrative that follows grant writing best practices and can be adapted for different opportunities.
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => handleGrandTypeChange('specific')}
                        className={`px-4 py-2 rounded-md ${
                            inputs.grantType === 'specific'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Specific Grant
                    </button>
                    <button
                        onClick={() => handleGrandTypeChange('open')}
                        className={`px-4 py-2 rounded-md ${
                            inputs.grantType === 'open'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Open Proposal
                    </button>
                </div>
            </div>

            {/* Grant Requirements (if specific grant selected) */}
            {inputs.grantType === 'specific' && (
                <div className="mb-6">
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Paste Grant Budget Requirements
                    </label>
                    <textarea
                        value={inputs.grantRequirements}
                        onChange={(e) => setInputs(prev => ({
                            ...prev,
                            grantRequirements: e.target.value
                        }))}
                        placeholder="Paste the budget-related requirements from the grant listing..."
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>
            )}

            {/* Budget Information */}
            <div className="space-y-6">
                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Total Amount Requested
                    </label>
                    <input
                        type="text"
                        value={inputs.budget.totalAmount}
                        onChange={(e) => handleInputChange('budget', 'totalAmount', e.target.value)}
                        placeholder="e.g., $50,000"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Budget Breakdown
                    </label>
                    <textarea
                        value={inputs.budget.breakdown}
                        onChange={(e) => handleInputChange('budget', 'breakdown', e.target.value)}
                        placeholder="List major budget categories and amounts..."
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Budget Justification
                    </label>
                    <textarea
                        value={inputs.budget.justification}
                        onChange={(e) => handleInputChange('budget', 'justification', e.target.value)}
                        placeholder="Explain why each cost is necessary..."
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Additional Funding Sources
                    </label>
                    <textarea
                        value={inputs.sustainability.additionalFunding}
                        onChange={(e) => handleInputChange('sustainability', 'additionalFunding', e.target.value)}
                        placeholder="Describe any matching funds, other grants, or revenue sources..."
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-m font-medium text-gray-700 mb-2">
                        Project Continuation Plan
                    </label>
                    <textarea
                        value={inputs.sustainability.continuationPlan}
                        onChange={(e) => handleInputChange('sustainability', 'continuationPlan', e.target.value)}
                        placeholder="How will the project continue after the grant period?"
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
                        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                        Generate Budget Content
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
