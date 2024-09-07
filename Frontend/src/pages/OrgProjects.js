import React from 'react';

export default function OrgProjects ({ onboardingFormData }) {


return (
    <div class="container grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-500">

        <div class="w-auto mx-5 md:col-span-2">
            {onboardingFormData.orgInitiatives.length > 0 && (
                <div className="rounded-lg p-4">
                    <h3 class="text-4xl font-bold text-gray-500 mb-8">Program Initiatives</h3>
                    <ul>
                        {onboardingFormData.orgInitiatives.map((initiative, index) => (
                            <li key={index}>
                                <strong className='text-gray-800 font-bold'>{initiative.initiative_name}</strong>
                                <br />
                                <h3 className='text-gray-400 font-bold'> - {initiative.initiative_description}</h3>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div class="w-auto mx-5">
            {onboardingFormData.orgProjects.length > 0 && (
                <div className="rounded-lg p-4">
                    <h3 class="text-4xl font-bold text-gray-500 mb-8">Previous Projects</h3>
                    <ul>
                        {onboardingFormData.orgProjects.map((project, index) => (
                            // check if project is ongoing
                            project.project_status === "completed" && (
                                <li key={index}>
                                    <strong className='text-gray-800 font-bold'>{project.project_name}</strong>
                                    <br />
                                    <h3 className='text-gray-400 font-bold'> - {project.project_description}</h3>
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div class="w-auto mx-5">
            {onboardingFormData.orgProjects.length > 0 && (
                <div className="rounded-lg p-4">
                    <h3 class="text-4xl font-bold text-gray-500 mb-8">Ongoing Projects</h3>
                    <ul>
                        {onboardingFormData.orgProjects.map((project, index) => (
                            // check if project is ongoing
                            project.project_status === "ongoing" && (
                                <li key={index}>
                                    <strong className='text-gray-800 font-bold'>{project.project_name}</strong>
                                    <br />
                                    <h3 className='text-gray-400 font-bold'> - {project.project_description}</h3>
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            )}
        </div>
</div>
    
    );
}