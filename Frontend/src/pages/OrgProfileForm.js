import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ProgramInitiativesList from '../components/OrgProfileFormComponents/ProgramsInitiatives';
import PreviousProjectsList from '../components/OrgProfileFormComponents/PreviousProjects';
import OngoingProjectsList from '../components/OrgProfileFormComponents/OngoingProjects';
import SupportNeeds from '../components/OrgProfileFormComponents/SupportNeeds';

import { useApi } from '../contexts/ApiProvider';

function OrgProfileForm( ) {

    const navigate = useNavigate();

    const apiClient = useApi();

    // Access and utilise admin details
    const location = useLocation();
    const { adminDetails } = location.state || {};

    const programInitiativesRef = useRef(null);
    const previousProjectsRef = useRef(null);
    const ongoingProjectsRef = useRef(null);
    const supportNeedsRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const programInitiatives = programInitiativesRef.current.getInitiativesData();
        const previousProjects = previousProjectsRef.current.getProjectsData();
        const ongoingProjects = ongoingProjectsRef.current.getProjectsData();
        const supportNeeds = supportNeedsRef.current.getSupportNeedsData();

        const formData = {
            adminDetails,
            programInitiatives,
            previousProjects,
            ongoingProjects,
            supportNeeds
        };

        try {
            console.log('Sending form data to the backend');
            const response = await apiClient.post('/profile/org/projects_initiatives', formData);

            if (response.status === 201) {
                console.log('Form data sent successfully');
            }
            
            // navigate to an organisations profile page based on the org_id
            navigate('/org_profile', { state: { adminDetails } });

        } catch (error) {
            console.error('Error sending form data to the backend:', error);
        }
    };

return (
    <form id='orgProfileForm' onSubmit={handleSubmit}>
        <div className="space-y-12 p-12 justify-center mx-52">
            <div className="flex border-b border-gray-900/10 pb-12 justify-center flex-col">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">Organisation Profile Form</h2>
                <p className="mt-1 text-xl leading-6 text-gray-600">
                    Welcome to the Organisation Profile Form. Please fill out the form below to get started.
                    This section is for the organisation to provide information about their programs, initiatives, projects and support needs.
                    It can be updated at any time.
                </p>

                <fieldset className="">
                    {/* <AdminDetails ref={adminDetailsRef} />  */}
                    <ProgramInitiativesList ref={programInitiativesRef} />
                    <PreviousProjectsList ref={previousProjectsRef} />
                    <OngoingProjectsList ref={ongoingProjectsRef} />
                    <SupportNeeds ref={supportNeedsRef} />

                </fieldset>

                <div class="mt-6 flex items-center justify-center gap-x-6">
                    <button type="button" class="text-sm rounded-md font-semibold px-3 py-2 leading-6 text-gray-900 hover:bg-indigo-500 hover:text-white">
                        Cancel
                    </button>
                    <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Save
                    </button>
                </div>
            </div> 
        </div>
    </form>
    );
}

export default OrgProfileForm;
