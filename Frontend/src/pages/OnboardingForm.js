import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminDetails from '../components/OnboardingFormComponents/AdminDetails';
import OrgDetails from '../components/OnboardingFormComponents/OrgDetails';
import OrgLogo from '../components/OnboardingFormComponents/OrgLogo';
import MissionStatement from '../components/OnboardingFormComponents/MissionStatement';
import ContactInfo from '../components/OnboardingFormComponents/ContactInfo';
import OrgAddress from '../components/OnboardingFormComponents/OrgAddress';
import CoverImageUpload from '../components/OnboardingFormComponents/OrgCoverImg';

import { useApi } from '../contexts/ApiProvider';

function OnboardingForm( ) {

    // Access the navigate function from the react-router-dom
    const navigate = useNavigate();

    // Access the apiClient from the ApiProvider
    const apiClient = useApi();

    const adminDetailsRef = useRef(null);
    const orgDetailsRef = useRef(null);
    const orgLogoRef = useRef(null);
    const missionStatementRef = useRef(null);
    const contactInfoRef = useRef(null);
    const orgAddressRef = useRef(null);
    const coverImageRef = useRef(null);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Access and utilize admin details
        const adminDetails = adminDetailsRef.current.getData();
        const orgDetails = orgDetailsRef.current.getData();
        const orgLogo = orgLogoRef.current.getData();
        const missionStatement = missionStatementRef.current.getData();
        const contactInfo = contactInfoRef.current.getData();
        const orgAddress = orgAddressRef.current.getData();
        const coverImage = coverImageRef.current.getImage();
        
        // Send data to the backend 
        const formData = {
            adminDetails,
            orgDetails,
            orgLogo,
            missionStatement,
            contactInfo,
            orgAddress,
            coverImage
        };

        try {
            console.log('Sending form data to the backend');
            const response = await apiClient.post('/profile/org', formData);

            if (response.status === 201) {
                console.log('Form data sent successfully');
            }
            
            // navigate to an organisations profile page based on the admin email in the adminDetails object
            navigate('/org_profile_form', { state: { adminDetails } });

        } catch (error) {
            console.error('Error sending form data to the backend:', error);
        }
    };

return (
    <form  id="onboardingForm" onSubmit={handleFormSubmit}>
        <div className="space-y-12 p-12 mx-52">
            <div className="flex border-b border-gray-900/10 pb-12 justify-center flex-col">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">Onboarding Form</h2>
                <p className="mt-1 text-xl leading-6 text-gray-600">
                    Welcome to the onboarding form. Please fill out the form below to get started.
                </p>
                
                <fieldset className="mb-6">
                    <AdminDetails ref={adminDetailsRef} /> 
                    <OrgDetails ref={orgDetailsRef} />
                    <MissionStatement ref={missionStatementRef} />
                    <OrgLogo ref={orgLogoRef} />
                    <CoverImageUpload ref={coverImageRef} />
                    <ContactInfo ref={contactInfoRef} />
                    <OrgAddress ref={orgAddressRef} />
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

export default OnboardingForm;
