import React, { useState, useEffect } from 'react';
import { 
    DocumentTextIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useApi } from '../../contexts/ApiProvider';
import { useAuth } from '../../contexts/AuthProvider';
import GeneratedContent from './GeneratedContent';
/**
 * ProjectNarrativeSection
 * 
 * Collects project details and generates a comprehensive narrative section
 * using AI assistance. Uses organization context to maintain consistency.
 * 
 * Features:
 * - Problem statement inputs
 * - Solution/approach details
 * - Goals and outcomes
 * - Timeline information
 * - Considers org context for cohesive narrative
 */
export default function ProjectNarrativeSection({ }) {

    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const apiClient = useApi();
    const { user } = useAuth();
    const userId = user ? user.id : null;

    // Load stored content from localStorage on mount
    useEffect(() => {
        const storedContent = localStorage.getItem(`${userId}_projectNarrative`);
        if (storedContent) {
            setGeneratedContent(storedContent);
        }
    }, []);

    const [inputs, setInputs] = useState({
        problem: {
            statement: '',
            affectedPopulation: '',
            currentSituation: '',
            relevance: ''
        },
        solution: {
            approach: '',
            methodology: '',
            innovation: ''
        },
        impact: {
            shortTerm: '',
            longTerm: '',
            beneficiaries: '',
            measurement: ''
        },
        timeline: {
            duration: '',
            majorPhases: '',
            keyMilestones: ''
        }
    });

    const sections = [
        {
            title: 'Problem Statement',
            stateKey: 'problem',
            fields: [
                {
                    id: 'statement',
                    label: 'What specific problem are you addressing?',
                    placeholder: 'Describe the core issue your project tackles...',
                    type: 'textarea'
                },
                {
                    id: 'affectedPopulation',
                    label: 'Who is affected by this problem?',
                    placeholder: 'Detail the communities or groups impacted...',
                    type: 'textarea'
                },
                {
                    id: 'currentSituation',
                    label: 'What is the current situation?',
                    placeholder: 'Explain the existing conditions and challenges...',
                    type: 'textarea'
                },
                {
                    id: 'relevance',
                    label: 'Why is addressing this important now?',
                    placeholder: 'Describe the urgency and significance...',
                    type: 'textarea'
                }
            ]
        },
        {
            title: 'Proposed Solution',
            stateKey: 'solution',
            fields: [
                {
                    id: 'approach',
                    label: 'What is your approach to solving this problem?',
                    placeholder: 'Outline your solution strategy...',
                    type: 'textarea'
                },
                {
                    id: 'methodology',
                    label: 'How will you implement this solution?',
                    placeholder: 'Detail your implementation methods...',
                    type: 'textarea'
                },
                {
                    id: 'innovation',
                    label: 'What makes your approach innovative or effective?',
                    placeholder: 'Highlight unique aspects of your solution...',
                    type: 'textarea'
                }
            ]
        },
        {
            title: 'Expected Impact',
            stateKey: 'impact',
            fields: [
                {
                    id: 'shortTerm',
                    label: 'What are the immediate outcomes?',
                    placeholder: 'List expected results in first year...',
                    type: 'textarea'
                },
                {
                    id: 'longTerm',
                    label: 'What are the long-term impacts?',
                    placeholder: 'Describe lasting changes...',
                    type: 'textarea'
                },
                {
                    id: 'beneficiaries',
                    label: 'Who will benefit and how?',
                    placeholder: 'Detail direct and indirect beneficiaries...',
                    type: 'textarea'
                },
                {
                    id: 'measurement',
                    label: 'How will you measure success?',
                    placeholder: 'Outline key metrics and evaluation methods...',
                    type: 'textarea'
                }
            ]
        },
        {
            title: 'Timeline',
            stateKey: 'timeline',
            fields: [
                {
                    id: 'duration',
                    label: 'What is the project duration?',
                    placeholder: 'e.g., 18 months, 2 years...',
                    type: 'text'
                },
                {
                    id: 'majorPhases',
                    label: 'What are the major project phases?',
                    placeholder: 'List main implementation phases...',
                    type: 'textarea'
                },
                {
                    id: 'keyMilestones',
                    label: 'What are the key milestones?',
                    placeholder: 'List important project milestones...',
                    type: 'textarea'
                }
            ]
        }
    ];

    const handleInputChange = (section, field, value) => {
        setInputs(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Get previous content for context
            const orgContent = localStorage.getItem(`${userId}_organizationContent`);

            const prompt = `You are an expert grant writer. Using the provided information, create a compelling project narrative section for a grant proposal. 
            Make it professional, clear, and persuasive.

            Organization Context:
            ${orgContent}

            Problem Information:
            ${inputs.problem.statement}
            Affected Population: ${inputs.problem.affectedPopulation}
            Current Situation: ${inputs.problem.currentSituation}
            Relevance: ${inputs.problem.relevance}

            Proposed Solution:
            Approach: ${inputs.solution.approach}
            Methodology: ${inputs.solution.methodology}
            Innovation: ${inputs.solution.innovation}

            Expected Impact:
            Short-term Outcomes: ${inputs.impact.shortTerm}
            Long-term Impact: ${inputs.impact.longTerm}
            Beneficiaries: ${inputs.impact.beneficiaries}
            Success Metrics: ${inputs.impact.measurement}

            Timeline:
            Duration: ${inputs.timeline.duration}
            Major Phases: ${inputs.timeline.majorPhases}
            Key Milestones: ${inputs.timeline.keyMilestones}

            Generate a cohesive project narrative that:
            1. Clearly states the problem and its significance
            2. Presents a compelling solution
            3. Details expected outcomes and impact
            4. Outlines a clear implementation timeline
            5. Maintains consistency with the organization's context
            6. Uses professional grant writing language and structure`;

            const response = await apiClient.post('/claude/generate', {
                prompt,
                section: 'projectNarrative'
            });

            setGeneratedContent(response.body.content);
            localStorage.setItem(`${userId}_projectNarrative`, response.body.content);
            
        } catch (error) {
            console.error('Generation failed:', error);
            setError('Failed to generate content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Narrative</h2>

            {/* Information Notice */}
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-normal">
                        <ul className="list-disc list-inside">
                            <li><span class="font-bold">Be thorough and specific</span> in your responses.</li>
                            <li><span class="font-bold">Provide context</span> where necessary, and include relevant details to support your points.</li>
                            <li><span class="font-bold">Ensure you highlight key information</span> that helps convey the urgency, impact, and effectiveness of your approach.</li>
                            <li>Keep your answers clear and focused while making sure to address all aspects of the request.</li>
                        </ul>
                    </p>
                </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            
            {/* Input Form */}
            <div className="space-y-8">
                {sections.map((section) => (
                    <div key={section.title} className="border-b border-gray-200 pb-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">
                            {section.title}
                        </h3>
                        <div className="space-y-4">
                            {section.fields.map((field) => (
                                <div key={field.id}>
                                    <label className="block text-m font-medium text-gray-700 mb-1">
                                        {field.label}
                                    </label>
                                    {field.type === 'textarea' ? (
                                    <textarea
                                        value={inputs[section.stateKey][field.id]}
                                        onChange={(e) => handleInputChange(
                                            section.stateKey,  // Use the explicit key
                                            field.id,
                                            e.target.value
                                        )}
                                        placeholder={field.placeholder}
                                        rows={3}
                                        className="block w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={inputs[section.stateKey][field.id]}
                                        onChange={(e) => handleInputChange(
                                            section.stateKey,  // Use the explicit key
                                            field.id,
                                            e.target.value
                                        )}
                                        placeholder={field.placeholder}
                                        className="block w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                                    />
                                )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Generate button that calls handleGenerate */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
                {isGenerating ? (
                    <>
                        <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                        Generating...
                    </>
                ) : (
                    <>
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Generate Narrative
                    </>
                )}
            </button>

            {/* Display generated content */}
            {generatedContent && (
                <GeneratedContent 
                    content={generatedContent}
                    onRegenerate={handleGenerate}
                    storageKey="projectNarrative"
                    title="Generated Project Narrative"
                />
            )}
        </div>
    );
}