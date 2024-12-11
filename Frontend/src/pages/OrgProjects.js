import React from 'react';
import { Translate, DynamicTranslate } from '../contexts/TranslationProvider';

// This component displays the organization's initiatives and projects.
// It includes fields for the initiative name, description, project name, and description.
export default function OrgProjects({ onboardingFormData }) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
            <Translate>Our Work</Translate>
        </h2>

        {onboardingFormData.orgInitiatives.length > 0 && (
            <div className="mb-8">
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
                <Translate>Program Initiatives</Translate>
            </h3>
            <ul className="space-y-4">
                {onboardingFormData.orgInitiatives.map((initiative, index) => (
                    <li key={index} className="bg-teal-50 rounded-lg p-4">
                        <h4 className="text-xl font-bold text-teal-700">
                            <DynamicTranslate>{initiative.initiative_name}</DynamicTranslate>
                        </h4>
                        <p className="text-gray-700 mt-2">
                            <DynamicTranslate>{initiative.initiative_description}</DynamicTranslate>
                        </p>
                    </li>
                ))}
            </ul>
            </div>
        )}

        {onboardingFormData.orgProjects.some(project => project.project_status === "ongoing") && (
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-indigo-600 mb-4">
                    <Translate>Ongoing Projects</Translate>
                </h3>
                <ul className="space-y-4">
                    {onboardingFormData.orgProjects.map((project, index) => (
                        project.project_status === "ongoing" && (
                            <li key={index} className="bg-indigo-50 rounded-lg p-4">
                                <h4 className="text-xl font-bold text-indigo-700">
                                    <DynamicTranslate>{project.project_name}</DynamicTranslate>
                                </h4>
                                <p className="text-gray-700 mt-2">
                                    <DynamicTranslate>{project.project_description}</DynamicTranslate>
                                </p>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        )}

        {onboardingFormData.orgProjects.some(project => project.project_status === "completed") && (
            <div>
                <h3 className="text-2xl font-bold text-amber-600 mb-4">
                    <Translate>Completed Projects</Translate>
                </h3>
                <ul className="space-y-4">
                    {onboardingFormData.orgProjects.map((project, index) => (
                        project.project_status === "completed" && (
                            <li key={index} className="bg-amber-50 rounded-lg p-4">
                                <h4 className="text-xl font-bold text-amber-700">
                                    <DynamicTranslate>{project.project_name}</DynamicTranslate>
                                </h4>
                                <p className="text-gray-700 mt-2">
                                    <DynamicTranslate>{project.project_description}</DynamicTranslate>
                                </p>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        )}
        </div>
    );
}