import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ProgramInitiativesList from '../components/OrgProfileFormComponents/ProgramsInitiatives';
import PreviousProjectsList from '../components/OrgProfileFormComponents/PreviousProjects';
import OngoingProjectsList from '../components/OrgProfileFormComponents/OngoingProjects';
import SupportNeeds from '../components/OrgProfileFormComponents/SupportNeeds';

function OrgProfileForm( ) {

    const navigate = useNavigate();

    // const adminDetailsRef = useRef(null);
    const programInitiativesRef = useRef(null);
    const previousProjectsRef = useRef(null);
    const ongoingProjectsRef = useRef(null);
    const supportNeedsRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Access and utilize admin details
        // const adminDetails = adminDetailsRef.current.getData();
        const programInitiatives = programInitiativesRef.current.getInitiativesData();
        const previousProjects = previousProjectsRef.current.getProjectsData();
        const ongoingProjects = ongoingProjectsRef.current.getProjectsData();
        const supportNeeds = supportNeedsRef.current.getSupportNeedsData();

        // Send adminDetails to the backend 
        const formData = {
            programInitiatives,
            previousProjects,
            ongoingProjects,
            supportNeeds
        };

        navigate('/org_profile');
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
