// In ParentComponent.js
import React from 'react';

export default function OrgProfile() { // Changed to an export default function

    const onboardingFormData = {
            "adminDetails": 
                {
                "name": "John Doe",
                "role": "Project Manager"
                },
            "orgDetails": 
                {
                "orgName": "Helping Hands",
                "aboutOrg": "Helping Hands empowers local communities by providing food, shelter, and educational resources to those in need."
                },
            "missionStatement": "To empower communities through service and education.",
            "contactInfo": 
                {
                "email": "info@helpinghands.org",
                "phone": "123-456-7890",
                },
            "orgAddress":
                {
                "districtTown": "Anytown",
                "county": "Any County",
                "poBox": "1234"
                }
        }

        const orgProfileFormData = {
            "programInitiatives": [
            {
                "initiativeName": "Community Food Drive",
                "description": "Collecting and distributing food donations."
            },
            {
                "initiativeName": "Mentorship Program",
                "description": "Pairing youth with volunteer mentors."
            }
            ],
            "previousProjects": [
            {
                "projectName": "Park Cleanup",
                "description": "Restoring and beautifying a local park."
            }
            ],
            "ongoingProjects": [
            {
                "projectName": "Clothing Drive",
                "description": "Collecting gently used clothing for those in need."
            }
            ],
            "supportNeeds": [
            {
                "techSkills": [
                { "value": "Web Development" },
                { "value": "Database Management" }
                ],
                "nonTechSkills": [
                { "value": "Event Planning" },
                { "value": "Volunteer Coordination" }
                ]
            }
            ]
        }
        
    return (
        <div> 
            <div class="px-4 sm:px-0">
                <div>
                    <h1 class="mb-2 text-9xl font-extrabold p-12 rounded-md"> 
                        <span class="text-orange-500 mx-0.5">{onboardingFormData.orgDetails.orgName.charAt(0)}</span>
                        <span class="text-orange-500 mx-1 border-b-2 border-blue-400">{onboardingFormData.orgDetails.orgName.charAt(1)}</span>
                        <span class="text-orange-500 mx-0.5">{onboardingFormData.orgDetails.orgName.charAt(2)}</span>
                        <span class="text-orange-500 border-b-4 border-blue-200">{onboardingFormData.orgDetails.orgName.charAt(3)}</span> 
                        <span class="text-orange-500 mx-0.5">{onboardingFormData.orgDetails.orgName.charAt(4)}</span>
                        <span class="text-orange-500 mx-1 border-b-2 border-blue-50">{onboardingFormData.orgDetails.orgName.charAt(5)}</span>
                        <span class="text-orange-500 mx-0.5">{onboardingFormData.orgDetails.orgName.charAt(6)}</span>
                        <span class="text-orange-500 mx-1 border-b-2 border-blue-400">{onboardingFormData.orgDetails.orgName.charAt(7)}</span>
                        <span class="text-orange-500 mx-0.5">{onboardingFormData.orgDetails.orgName.charAt(8)}</span>
                        <span class="text-orange-500 mx-1 border-b-2 border-blue-300">{onboardingFormData.orgDetails.orgName.charAt(9)}</span>
                        <span class="text-orange-500 mx-0.5">{onboardingFormData.orgDetails.orgName.charAt(10)}</span>
                        <span class="text-orange-500 mx-1 border-b-2 border-blue-100">{onboardingFormData.orgDetails.orgName.charAt(11)}</span>
                        <span class="text-orange-500 mx-0.5">{onboardingFormData.orgDetails.orgName.charAt(12)}</span>
                    </h1>

                    {/* Organisation Details */}
                    <div className="rounded-lg p-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        <p className="font-normal text-orange-800">
                            <span className="font-medium" style={{ fontSize: '50px', fontWeight: 'bold' }}>
                                {onboardingFormData.orgDetails.aboutOrg}
                            </span>
                        </p>
                    </div>
                </div>

                <div class="container p-6 grid grid-cols-4">
                    <div class="col-span-2 bg-yellow-50 rounded-lg p-4 mb-10 w-96 mx-5 my-4">
                        <h2 class="text-lg font-bold text-orange-500 text-center">Mission Statement</h2>
                        <p class="text-center font-bold text-orange-800 mt-4">
                        {onboardingFormData.missionStatement}
                        </p>
                    </div> 

                    <div class="bg-yellow-50  w-60 mb-8">
                        <div class="rounded-lg p-6 text-center mx-5 my-4">
                            <h2 class="text-lg font-bold text-orange-500 mb-4">Contact Info</h2>
                            <ul class="list-disc space-y-2 font-bold text-orange-800">
                                <li>{onboardingFormData.contactInfo.email}</li>
                                <li>{onboardingFormData.contactInfo.phone}</li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-yellow-50 grid-cols-2  w-60 mb-8 mx-10">
                        <div class="rounded-lg bg-yellow-50 p-4 w-60">
                            <h2 class="text-lg font-bold text-orange-500 text-center">Address</h2>
                            <ul class="list-disc space-y-2 font-bold text-orange-800">
                                <li>District / Town: {onboardingFormData.orgAddress.districtTown}</li>
                                <li>County: {onboardingFormData.orgAddress.county}</li>
                                <li>PO Box: {onboardingFormData.orgAddress.poBox}</li>
                            </ul>
                        </div>
                    </div>
                </div> 

                <div class="container mx-auto p-6 bg-yellow-50 grid grid-cols-3 my-10"> 
                
                    <div class="w-auto mx-5"> 
                    {orgProfileFormData.programInitiatives.length > 0 && (
                        <div className="rounded-lg bg-white p-4  bg-red-50">
                            <h3 class="text-4xl font-bold text-orange-500 mb-8">Program Initiatives</h3>
                            <ul>
                                {orgProfileFormData.programInitiatives.map((initiative, index) => (
                                <li key={index}>
                                    <strong className='text-orange-800 font-bold'>{initiative.initiativeName}</strong>
                                    <br />
                                    <h3 className='text-orange-400 font-bold'> - {initiative.description}</h3>
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>

                    <div class="w-auto mx-5"> 
                    {orgProfileFormData.previousProjects.length > 0 && (
                        <div className="rounded-lg bg-white p-4  bg-red-50">
                            <h3 class="text-4xl font-bold text-orange-500 mb-8">Previous Projects</h3>
                            <ul>
                                {orgProfileFormData.previousProjects.map((project, index) => (
                                    <li key={index}>
                                    <strong className='text-orange-800 font-bold'>{project.projectName}</strong>
                                    <br />
                                    <h3 className='text-orange-400 font-bold'> - {project.description}</h3>
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>

                    <div class="w-auto mx-5">
                    {orgProfileFormData.ongoingProjects.length > 0 && (
                        <div className="rounded-lg bg-white p-4  bg-red-50">
                            <h3 class="text-4xl font-bold text-orange-500 mb-8">Ongoing Projects</h3>
                            <ul>
                                {orgProfileFormData.ongoingProjects.map((project, index) => (
                                    <li key={index}>
                                    <strong className='text-orange-800 font-bold'>{project.projectName}</strong>
                                    <br />
                                    <h3 className='text-orange-400 font-bold'> - {project.description}</h3>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>
                </div>

                <div>
                    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"> 
                        {orgProfileFormData.supportNeeds.length > 0 && (
                            <div className="rounded-lg bg-white p-4  bg-red-50 mx-auto">
                                <h3 class="text-4xl font-bold text-orange-500 mb-8">Volunteering Needs</h3>

                                {orgProfileFormData.supportNeeds.map((project, index) => (
                                    <div key={index}> 

                                        {project.techSkills.length > 0 && (
                                            <div className='rounded-lg bg-yellow-50 p-4  mb-8'>
                                                <h3 class="text-lg font-bold text-orange-800">Tech Skills</h3>
                                                <ul>
                                                    {project.techSkills.map((skill, index) => (
                                                        <li key={index} className='text-orange-400 font-semibold'>
                                                            {skill.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {project.nonTechSkills.length > 0 && (
                                            <div className='rounded-lg bg-yellow-50 p-4  mb-8'>
                                                <h3 class="text-lg font-bold text-orange-800">Non-Tech Skills</h3>
                                                <ul>
                                                    {project.nonTechSkills.map((skill, index) => (
                                                        <li key={index} className='text-orange-400 font-semibold'>
                                                            {skill.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
    </div>
    );
}
