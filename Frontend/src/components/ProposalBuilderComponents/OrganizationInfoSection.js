import React, { useState, useEffect } from 'react';
import { BuildingOfficeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useApi } from '../../contexts/ApiProvider';
import { useAuth } from '../../contexts/AuthProvider';
import GeneratedContent from './GeneratedContent';

/**
 * OrganizationInfoSection
 * 
 * Displays and manages organization information for grant proposals.
 * Loads data from the API and allows for proposal-specific additions.
 * 
 * Features:
 * - Uses auth context for user identification
 * - Loads existing org profile data from API
 * - Displays loading states and error handling
 * - Allows additional proposal-specific details
 * - Generates AI-enhanced content for grant proposals
 * - Saves to localStorage for proposal persistence
 */
export default function OrganizationInfoSection() {
    const apiClient = useApi();
    const { user } = useAuth();
    const userId = user ? user.id : null;
    
    const [loading, setLoading] = useState(true);
    const [orgData, setOrgData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [generatedContent, setGeneratedContent] = useState('');

    // Load stored content from localStorage on mount
    useEffect(() => {
        const storedContent = localStorage.getItem('organizationContent');
        if (storedContent) {
            setGeneratedContent(storedContent);
        }
    }, []);

    // State for form inputs, will be populated with org data
    const [inputs, setInputs] = useState({
        // Basic Info (pre-populated)
        orgName: '',
        yearEstablished: '',
        registrationNumber: '',
        missionStatement: '',
        
        // Contact Info (pre-populated)
        location: {
            country: '',
            county: '',
            district: ''
        },
        contact: {
            email: '',
            phone: '',
            website: ''
        },

        // Grant-Specific Info (user input)
        grantSpecific: {
            orgCapacity: '',
            previousGrants: '',
            successStories: '',
            teamQualifications: '',
            partnershipHistory: '',
            relevantInitiatives: '',
            ongoingProjects: ''
        }
    });

    // Load org data when userId is available
    useEffect(() => {
        const loadOrgData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await apiClient.get(`/profile/load_org?user_id=${userId}`);
                
                if (response.ok) {
                    setOrgData(response.body);
                    
                    // Update inputs with loaded data
                    const { orgProfile, orgInitiatives, orgProjects } = response.body;
                    
                    setInputs(prev => ({
                        ...prev,
                        orgName: orgProfile.org_name,
                        yearEstablished: orgProfile.org_year_established,
                        registrationNumber: orgProfile.org_registration_number,
                        missionStatement: orgProfile.org_mission_statement,
                        location: {
                            country: orgProfile.org_country,
                            county: orgProfile.org_county,
                            district: orgProfile.org_district_town
                        },
                        contact: {
                            email: orgProfile.org_email,
                            phone: orgProfile.org_phone,
                            website: orgProfile.org_website || ''
                        },
                        // Pre-populate relevant initiatives and projects
                        grantSpecific: {
                            ...prev.grantSpecific,
                            relevantInitiatives: orgInitiatives
                                .map(init => `${init.initiative_name}: ${init.initiative_description}`)
                                .join('\n\n'),
                            ongoingProjects: orgProjects
                                .filter(proj => proj.project_status === 'ongoing')
                                .map(proj => `${proj.project_name}: ${proj.project_description}`)
                                .join('\n\n')
                        }
                    }));
                } else {
                    setError("Failed to load organization data");
                    console.error("Error fetching data: ", response.body);
                }
            } catch (error) {
                setError("Error connecting to server");
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrgData();
    }, [apiClient, userId]);

    const handleInputChange = (section, field, value) => {
        setInputs(prev => ({
            ...prev,
            [section]: section === 'grantSpecific' || section === 'location' || section === 'contact'
                ? { ...prev[section], [field]: value }
                : value
        }));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const prompt = `Create a professional organization background section for a grant proposal using the following information:

            Organization Name: ${inputs.orgName}
            Year Established: ${inputs.yearEstablished}
            Registration: ${inputs.registrationNumber}
            Mission: ${inputs.missionStatement}

            Location: ${inputs.location.district}, ${inputs.location.county}, ${inputs.location.country}

            Current Initiatives:
            ${inputs.grantSpecific.relevantInitiatives}

            Ongoing Projects:
            ${inputs.grantSpecific.ongoingProjects}

            Additional Context:
            Organizational Capacity: ${inputs.grantSpecific.orgCapacity}
            Previous Grants: ${inputs.grantSpecific.previousGrants}
            Success Stories: ${inputs.grantSpecific.successStories}
            Team Qualifications: ${inputs.grantSpecific.teamQualifications}
            Partnership History: ${inputs.grantSpecific.partnershipHistory}

            Please create a compelling narrative that:
            1. Establishes organizational credibility
            2. Highlights relevant experience and success
            3. Demonstrates capacity to implement projects
            4. Showcases strong governance and accountability
            5. Uses professional grant writing language`;

            const response = await apiClient.post('/claude/generate', {
                prompt,
                section: 'organizationInfo'
            });

            setGeneratedContent(response.body.content);
            localStorage.setItem('organizationContent', response.body.content);

        } catch (error) {
            console.error('Generation failed:', error);
            setError('Failed to generate content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    Please log in to access organization information.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Information</h2>
            
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                {/* Information Notice */}
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                        This section builds upon your organization's existing profile information. The following fields are optional 
                        and should only be filled if they provide additional context specific to this grant application. 
                        If the information is already covered in your organization profile, you may leave these fields blank.
                    </p>
                </div>

                {/* Pre-populated Organization Information */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-m font-medium text-gray-700">Organization Name</label>
                            <input
                                type="text"
                                value={inputs.orgName}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-m font-medium text-gray-700">Year Established</label>
                            <input
                                type="text"
                                value={inputs.yearEstablished}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Current Initiatives & Projects */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Current Work</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-m font-medium text-gray-700">
                                Relevant Initiatives
                            </label>
                            <textarea
                                value={inputs.grantSpecific.relevantInitiatives}
                                onChange={(e) => handleInputChange('grantSpecific', 'relevantInitiatives', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-medium text-gray-700">
                                Ongoing Projects
                            </label>
                            <textarea
                                value={inputs.grantSpecific.ongoingProjects}
                                onChange={(e) => handleInputChange('grantSpecific', 'ongoingProjects', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Grant-Specific Information */}
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Additional Grant-Specific Details (Optional)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-m font-medium text-gray-700">
                                Project-Specific Organizational Capacity
                            </label>
                            <textarea
                                value={inputs.grantSpecific.orgCapacity}
                                onChange={(e) => handleInputChange('grantSpecific', 'orgCapacity', e.target.value)}
                                placeholder="If relevant, describe any additional capacity specific to this project..."
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-medium text-gray-700">
                                Relevant Grant Experience
                            </label>
                            <textarea
                                value={inputs.grantSpecific.previousGrants}
                                onChange={(e) => handleInputChange('grantSpecific', 'previousGrants', e.target.value)}
                                placeholder="If applicable, mention specific grants relevant to this application..."
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-medium text-gray-700">
                                Project-Specific Success Stories
                            </label>
                            <textarea
                                value={inputs.grantSpecific.successStories}
                                onChange={(e) => handleInputChange('grantSpecific', 'successStories', e.target.value)}
                                placeholder="If relevant, share success stories related to similar projects..."
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-medium text-gray-700">
                                Additional Team Qualifications
                            </label>
                            <textarea
                                value={inputs.grantSpecific.teamQualifications}
                                onChange={(e) => handleInputChange('grantSpecific', 'teamQualifications', e.target.value)}
                                placeholder="If applicable, mention specific team qualifications relevant to this project..."
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-medium text-gray-700">
                                Relevant Partnership History
                            </label>
                            <textarea
                                value={inputs.grantSpecific.partnershipHistory}
                                onChange={(e) => handleInputChange('grantSpecific', 'partnershipHistory', e.target.value)}
                                placeholder="If applicable, describe partnerships relevant to this specific project..."
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
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
                            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                            Generate Organization Section
                        </>
                    )}
                </button>
            </div>
            

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