import React from 'react';
// This component displays the organization's initiatives and projects.
// It includes fields for the initiative name, description, project name, and description.
export default function OrgProjects({ onboardingFormData }) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Work</h2>
        
        {onboardingFormData.orgInitiatives.length > 0 && (
            <div className="mb-8">
            <h3 className="text-2xl font-bold text-teal-600 mb-4">Program Initiatives</h3>
            <ul className="space-y-4">
                {onboardingFormData.orgInitiatives.map((initiative, index) => (
                <li key={index} className="bg-teal-50 rounded-lg p-4">
                    <h4 className="text-xl font-bold text-teal-700">{initiative.initiative_name}</h4>
                    <p className="text-gray-700 mt-2">{initiative.initiative_description}</p>
                </li>
                ))}
            </ul>
            </div>
        )}

        {onboardingFormData.orgProjects.some(project => project.project_status === "ongoing") && (
            <div className="mb-8">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">Ongoing Projects</h3>
            <ul className="space-y-4">
                {onboardingFormData.orgProjects.map((project, index) => (
                project.project_status === "ongoing" && (
                    <li key={index} className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="text-xl font-bold text-indigo-700">{project.project_name}</h4>
                    <p className="text-gray-700 mt-2">{project.project_description}</p>
                    </li>
                )
                ))}
            </ul>
            </div>
        )}

        {onboardingFormData.orgProjects.some(project => project.project_status === "completed") && (
            <div>
            <h3 className="text-2xl font-bold text-amber-600 mb-4">Completed Projects</h3>
            <ul className="space-y-4">
                {onboardingFormData.orgProjects.map((project, index) => (
                project.project_status === "completed" && (
                    <li key={index} className="bg-amber-50 rounded-lg p-4">
                    <h4 className="text-xl font-bold text-amber-700">{project.project_name}</h4>
                    <p className="text-gray-700 mt-2">{project.project_description}</p>
                    </li>
                )
                ))}
            </ul>
            </div>
        )}
        </div>
    );
}