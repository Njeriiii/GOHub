import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    Save, 
    Rocket, 
    Star,
    Target,
    Trophy,
    Heart
} from 'lucide-react';

import ProgramInitiativesList from '../components/OrgProfileFormComponents/ProgramsInitiatives';
import PreviousProjectsList from '../components/OrgProfileFormComponents/PreviousProjects';
import OngoingProjectsList from '../components/OrgProfileFormComponents/OngoingProjects';
import SupportNeeds from '../components/OrgProfileFormComponents/SupportNeeds';

import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';

const OrgProfileForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);

    const navigate = useNavigate();
    const apiClient = useApi();
    const { getUserId } = useAuth();

    const programInitiativesRef = useRef(null);
    const previousProjectsRef = useRef(null);
    const ongoingProjectsRef = useRef(null);
    const supportNeedsRef = useRef(null);

    const sections = [
        { ref: programInitiativesRef, icon: Rocket, title: "Programs & Initiatives", color: "bg-teal-600" },
        { ref: ongoingProjectsRef, icon: Target, title: "Ongoing Projects", color: "bg-teal-600" },
        { ref: previousProjectsRef, icon: Trophy, title: "Previous Projects", color: "bg-teal-600" },
        { ref: supportNeedsRef, icon: Heart, title: "Support Needs", color: "bg-teal-600" }
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const formData = {
            user_id: getUserId(),
            programInitiatives: programInitiativesRef.current?.getData() || [],
            previousProjects: previousProjectsRef.current?.getData() || [],
            ongoingProjects: ongoingProjectsRef.current?.getData() || [],
            supportNeeds: supportNeedsRef.current?.getData() || {
                techSkills: [],
                nonTechSkills: [],
                needVolunteers: false
            }
        };

        try {
            const response = await apiClient.post('/profile/org/projects_initiatives', formData);
            if (response.status === 201) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Form submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex flex-col items-center space-y-2 bg-white rounded-2xl px-6 py-3">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Create Your Organization Profile
                        </h2>
                        <p className="text-gray-500 text-xl">
                            Complete your organization's profile to connect with potential volunteers and donors!
                        </p>
                    </div>
                </div>


                {/* Progress indicators */}
                <div className="flex justify-center mb-8 gap-3">
                    {sections.map((section, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSection(index)}
                            className={`flex items-center px-4 py-2 rounded-xl transition-all ${
                                currentSection === index 
                                    ? `${section.color} text-white`
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <section.icon className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline text-sm font-medium">
                                {section.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Main content */}
                <div className="bg-white rounded-xl">
                    <div className="p-8">
                        {sections.map((section, index) => (
                            <div 
                                key={index}
                                className={`transition-all duration-300 ${
                                    currentSection === index ? 'opacity-100' : 'opacity-0 hidden'
                                }`}
                            >
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className={`p-2 rounded-xl ${section.color}`}>
                                        <section.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {section.title}
                                    </h3>
                                </div>
                                {index === 0 && <ProgramInitiativesList ref={programInitiativesRef} />}
                                {index === 1 && <OngoingProjectsList ref={ongoingProjectsRef} />}
                                {index === 2 && <PreviousProjectsList ref={previousProjectsRef} />}
                                {index === 3 && <SupportNeeds ref={supportNeedsRef} />}
                            </div>
                        ))}

                        {error && (
                            <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4 text-red-600">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-600">
                                Profile successfully updated! Redirecting...
                            </div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex justify-between items-center mt-8">
                            {currentSection > 0 ? (
                                <button
                                    onClick={() => setCurrentSection(curr => curr - 1)}
                                    className="flex items-center space-x-2 px-6 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span>Previous</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center space-x-2 px-6 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span>Exit</span>
                                </button>
                            )}

                            {currentSection < sections.length - 1 ? (
                                <button
                                    onClick={() => setCurrentSection(curr => curr + 1)}
                                    className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                                >
                                    <span>Next</span>
                                    <ChevronLeft className="h-4 w-4 rotate-180" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{isSubmitting ? 'Saving...' : 'Complete Profile'}</span>
                                    <Save className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgProfileForm;