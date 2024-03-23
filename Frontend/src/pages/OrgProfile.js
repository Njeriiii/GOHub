// In ParentComponent.js
import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';

export default function OrgProfile() { // Changed to an export default 
    
    // State variable to hold fetched data
    const [onboardingFormData, setOnboardingFormData] = useState(null);

    // State variable to hold loading status
    const [loading, setLoading] = useState(true);

    const apiClient = useApi();

    // Define the adminDetails variable
    let adminDetails;

    // Access and utilise admin details
    const location = useLocation();

    if (location.state?.adminDetails) {
        adminDetails = location.state.adminDetails; 
    } else if (location.state?.org) { // Check if org exists
        adminDetails = location.state.org; 
    } else {
        // Handle the case where neither exists (error handling)
        console.error('Neither adminDetails nor org found in location.state');
    }

    // Load the organisation's data from the backend using the admin email
    useEffect(() => {

        if (!adminDetails) {
            return;
        }

        apiClient.get(`/profile/org/${adminDetails.email}`)
            .then((response) => {

                if (response.ok) {
                    setOnboardingFormData(response?.body);
                    setLoading(false);

                } else if (response.status === 401) {
                }
                else {
                    console.error("Error fetching data: ", response.body);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });

    }, [apiClient]);


    return (
        <div> 
            {/* check if onboardingFormData is null */}
            {loading && <p>Loading...</p>}
            {!loading && onboardingFormData && (
                
            <div class="px-4 sm:px-0">
                <div>
                    <h1 class="mb-2 text-9xl font-extrabold p-12 rounded-md">
                        {onboardingFormData.orgProfile.org_name.split('').map((char, index) => (
                            <span key={index} className={`text-orange-500 mx-${index % 2 === 0 ? '0.5' : '1'} border-b-${index % 4 === 0 ? '4' : '2'} border-blue-${(index % 4) * 100}`}>
                                {char}
                            </span>
                        ))}
                    </h1>

                    {/* Organisation Details */}
                    <div className="rounded-lg p-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        <p className="font-normal text-orange-800">
                            <span className="font-medium" style={{ fontSize: '50px', fontWeight: 'bold' }}>
                                {onboardingFormData.orgProfile.org_overview}
                            </span>
                        </p>
                    </div>
                </div>

                <div class="container p-6 grid grid-cols-4">
                    <div class="col-span-2 bg-yellow-50 rounded-lg p-4 mb-10 w-96 mx-5 my-4">
                        <h2 class="text-lg font-bold text-orange-500 text-center">Mission Statement</h2>
                        <p class="text-center font-bold text-orange-800 mt-4">
                        {onboardingFormData.orgProfile.org_mission_statement}
                        </p>
                    </div> 

                    <div class="bg-yellow-50  w-60 mb-8">
                        <div class="rounded-lg p-6 text-center mx-5 my-4">
                            <h2 class="text-lg font-bold text-orange-500 mb-4">Contact Info</h2>
                            <ul class="list-disc space-y-2 font-bold text-orange-800">
                                <li>{onboardingFormData.orgProfile.org_email}</li>
                                <li>{onboardingFormData.orgProfile.org_phone}</li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-yellow-50 grid-cols-2  w-60 mb-8 mx-10">
                        <div class="rounded-lg bg-yellow-50 p-4 w-60">
                            <h2 class="text-lg font-bold text-orange-500 text-center">Address</h2>
                            <ul class="list-disc space-y-2 font-bold text-orange-800">
                                <li>District / Town: {onboardingFormData.orgProfile.org_district_town}</li>
                                <li>County: {onboardingFormData.orgProfile.org_county}</li>
                                <li>PO Box: {onboardingFormData.orgProfile.org_po_box}</li>
                            </ul>
                        </div>
                    </div>
                </div> 

                <div class="container mx-auto p-6 bg-yellow-50 grid grid-cols-3 my-10"> 
                    <div class="w-auto mx-5"> 
                    {onboardingFormData.orgInitiatives.length > 0 && (
                        <div className="rounded-lg  p-4  bg-red-50">
                            <h3 class="text-4xl font-bold text-orange-500 mb-8">Program Initiatives</h3>
                            <ul>
                                {onboardingFormData.orgInitiatives.map((initiative, index) => (
                                <li key={index}>
                                    <strong className='text-orange-800 font-bold'>{initiative.initiative_name}</strong>
                                    <br />
                                    <h3 className='text-orange-400 font-bold'> - {initiative.initiative_description}</h3>
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>

                    <div class="w-auto mx-5"> 
                    {onboardingFormData.orgProjects.length > 0 && (
                        <div className="rounded-lg p-4  bg-red-50">
                            <h3 class="text-4xl font-bold text-orange-500 mb-8">Previous Projects</h3>
                            <ul>
                                {onboardingFormData.orgProjects.map((project, index) => (
                                    // check if project is ongoing
                                    project.project_status === "completed" && (
                                        <li key={index}>
                                            <strong className='text-orange-800 font-bold'>{project.project_name}</strong>
                                            <br/>
                                            <h3 className='text-orange-400 font-bold'> - {project.project_description}</h3>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>
                    <div class="w-auto mx-5">
                    {onboardingFormData.orgProjects.length > 0 && (
                        <div className="rounded-lg  p-4  bg-red-50">
                            <h3 class="text-4xl font-bold text-orange-500 mb-8">Ongoing Projects</h3>
                            <ul>
                                {onboardingFormData.orgProjects.map((project, index) => (
                                    // check if project is ongoing
                                    project.project_status === "ongoing" && (
                                        <li key={index}>
                                            <strong className='text-orange-800 font-bold'>{project.project_name}</strong>
                                            <br/>
                                            <h3 className='text-orange-400 font-bold'> - {project.project_description}</h3>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>
                </div>

                <div>
                    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"> 
                        {onboardingFormData.orgSkillsNeeded.length > 0 && (
                            <div className="rounded-lg  p-4  bg-red-50 mx-auto">
                                <h3 class="text-4xl font-bold text-orange-500 mb-8">Volunteering Needs</h3>
                                <h3 class="text-lg font-bold text-orange-800">Tech Skills</h3>

                                {onboardingFormData.orgSkillsNeeded.map((skill, index) => (
                                    <div key={index}> 
                                        {skill.status === "tech" && (
                                            <div className='rounded-lg bg-yellow-50 p-4  mb-8'>
                                                <ul>
                                                    <li key={index} className='text-orange-400 font-semibold'>
                                                        {skill.skill}
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <h3 class="text-lg font-bold text-orange-800">Non-Tech Skills</h3>
                                {onboardingFormData.orgSkillsNeeded.map((skill, index) => (
                                    <div key={index}> 
                                        {skill.status === "non-tech" && (
                                            <div className='rounded-lg bg-yellow-50 p-4  mb-8'>
                                                <ul>
                                                    <li key={index} className='text-orange-400 font-semibold'>
                                                        {skill.skill}
                                                    </li>
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
            )}
    </div>
    );
}
