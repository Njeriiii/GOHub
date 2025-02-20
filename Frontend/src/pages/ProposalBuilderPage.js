import React, { useState, useEffect } from 'react';
import { 
    BuildingOfficeIcon, 
    DocumentIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';
import ProjectNarrativeSection from '../components/ProposalBuilderComponents/ProjectNarrativeSection';
import OrganizationInfoSection from '../components/ProposalBuilderComponents/OrganizationInfoSection';
import ProposalBudgetSection from '../components/ProposalBuilderComponents/ProposalBudgetSection';
import ExecutiveSummarySection from '../components/ProposalBuilderComponents/ExecutiveSummarySection';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthProvider';

/**
 * ProposalBuilder
 * 
 * A step-by-step grant proposal generator that creates professional proposal content
 * based on user inputs. The tool guides users through four main sections:
 * 
 * 1. Organization Information - Details about your organization
 * 2. Project Narrative - Core project description and goals
 * 3. Budget - Financial requirements and justification
 * 4. Executive Summary - Comprehensive overview (generated last, displayed first)
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
    const [showTip, setShowTip] = useState(true);
    const { user } = useAuth();
    console.log(user);
    const userId = user ? user.id : null;
    const [completedSections, setCompletedSections] = useState(() => {
        // Initialize from localStorage
        const saved = localStorage.getItem(`${userId}_completedSections`);
        return saved ? JSON.parse(saved) : [];
    });

    const sections = [
        { id: 'organizationInfo', label: 'Organization Information', icon: BuildingOfficeIcon },
        { id: 'projectNarrative', label: 'Project Narrative', icon: DocumentIcon },
        { id: 'proposalBudget', label: 'Budget', icon: CurrencyDollarIcon },
        { id: 'executiveSummary', label: 'Executive Summary', icon: DocumentTextIcon }
    ];

    // Track section completion
    useEffect(() => {
        const handleStorageChange = () => {
            const completed = [];
            if (localStorage.getItem(`${userId}_organizationContent`)) completed.push('organizationInfo');
            if (localStorage.getItem(`${userId}_projectNarrative`)) completed.push('projectNarrative');
            if (localStorage.getItem(`${userId}_proposalBudget`)) completed.push('proposalBudget');
            if (localStorage.getItem(`${userId}_executiveSummary`)) completed.push('executiveSummary');
            
            setCompletedSections(completed);
            localStorage.setItem(`${userId}_completedSection`, JSON.stringify(completed));
        };

        // Check on mount and when localStorage changes
        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Introduction section */}
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
                            </div>
                        </div>
                    </div>

                    {/* Progress Overview */}
                    {showTip && (
                        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex space-x-2">
                                    <ArrowDownIcon className="h-5 w-5 text-yellow-600" />
                                    <div>
                                        <p className="text 
                                        text-yellow-800">
                                            <span className="font-bold">Recommended order:</span> Complete sections from left to right. The Executive Summary should be written last as it draws from all other sections.
                                        </p>
                                        <p className="text-yellow-600 text-sm mt-1">
                                            Progress is automatically saved as you work.
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowTip(false)}
                                    className="text-yellow-600 hover:text-yellow-800"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section Navigation */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="flex space-x-4" aria-label="Sections">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`
                                        relative py-4 px-1 border-b-2 font-medium text-lg
                                        ${activeSection === section.id
                                            ? 'border-teal-500 text-teal-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <section.icon className="h-5 w-5 inline-block mr-2" />
                                    {section.label}
                                    {completedSections.includes(section.id) && (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 absolute -top-2 -right-2" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mb-8">
                        {!(userId && user && user.is_admin) ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800">
                                    Please log in to access your organization's information. This tool is only available to registered CBO founders.
                                </p>
                            </div>
                        ) : (
                            <>
                                {activeSection === 'projectNarrative' && <ProjectNarrativeSection />}
                                {activeSection === 'organizationInfo' && <OrganizationInfoSection />}
                                {activeSection === 'proposalBudget' && <ProposalBudgetSection />}
                                {activeSection === 'executiveSummary' && <ExecutiveSummarySection />}
                            </>
                        )}
                    </div>

                    {/* Section Navigation Footer */}
                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => {
                                const currentIndex = sections.findIndex(s => s.id === activeSection);
                                if (currentIndex > 0) {
                                    setActiveSection(sections[currentIndex - 1].id);
                                }
                            }}
                            disabled={activeSection === sections[0].id}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous Section
                        </button>
                        <button
                            onClick={() => {
                                const currentIndex = sections.findIndex(s => s.id === activeSection);
                                if (currentIndex < sections.length - 1) {
                                    setActiveSection(sections[currentIndex + 1].id);
                                }
                            }}
                            disabled={activeSection === sections[sections.length - 1].id}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Section
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}