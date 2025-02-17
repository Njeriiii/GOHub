import React, { useState } from 'react';
import { 
    BuildingOfficeIcon, 
    DocumentIcon,
    CurrencyDollarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import ProjectNarrativeSection from '../components/ProposalBuilderComponents/ProjectNarrativeSection';
import OrganizationInfoSection from '../components/ProposalBuilderComponents/OrganizationInfoSection';
import ProposalBudgetSection from '../components/ProposalBuilderComponents/ProposalBudgetSection';
import Header from '../components/Header';

/**
 * ProposalBuilder
 * 
 * A step-by-step grant proposal generator that creates professional proposal content
 * based on user inputs. The tool guides users through four main sections:
 * 
 * 1. Organization Information - Details about your organization
 * 2. Project Narrative - Core project description and goals
 * 3. Budget - Financial requirements and justification
 * 4. Project Summary - Executive summary (generated last, displayed first)
 * 
 * Each section:
 * - Collects specific inputs
 * - Generates content using AI
 * - Builds upon previous sections' content
 * - Can be regenerated as needed
 * 
 * Content is saved to localStorage for persistence between sessions.
 */
export default function ProposalBuilder() {
    const [activeSection, setActiveSection] = useState('organizationInfo');

    const sections = [
        { id: 'organizationInfo', label: 'Organization Information', icon: BuildingOfficeIcon },
        { id: 'projectNarrative', label: 'Project Narrative', icon: DocumentIcon },
        { id: 'proposalBudget', label: 'Budget', icon: CurrencyDollarIcon },
        { id: 'summary', label: 'Project Summary', icon: DocumentTextIcon }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                {/* Introduction section */}
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                AI-Powered Grant Proposal Builder
                            </h1>
                            <div className="space-y-4 text-gray-600">
                                <p className="text-lg">
                                    Transform your project ideas into professionally written grant proposals. Our AI assistant guides you through each section, ensuring comprehensive and compelling content.
                                </p>
                                <div className="flex space-x-4">
                                    <div className="border-l-4 border-teal-500 pl-4">
                                        <h2 className="font-medium text-gray-900">Professional Quality</h2>
                                        <p className="text-lg mt-1">Generate polished, funder-ready content that follows grant writing best practices.</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                                    <p className="text-lg">
                                        <span className="font-medium">Pro tip:</span> While we'll generate your project summary last, it should appear first in your final document. This ensures it captures the essence of your complete proposal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/* Section Navigation */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="flex space-x-4" aria-label="Sections">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`
                                        py-4 px-1 border-b-2 font-medium text-lg
                                        ${activeSection === section.id
                                            ? 'border-teal-500 text-teal-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <section.icon className="h-5 w-5 inline-block mr-2" />
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Navigation and Section Content */}
                    <div>                      
                        {/* Project Narrative Section */}
                        {activeSection === 'projectNarrative' && (
                        <ProjectNarrativeSection/> )}

                        {/* Organization Information Section */}
                        {activeSection === 'organizationInfo' && (
                        <OrganizationInfoSection/> )}

                        {/* Proposal Budget Section */}
                        {activeSection === 'proposalBudget' && (
                        <ProposalBudgetSection/> )}
                    </div>
                </div>
            </main>
        </div>
    );
}