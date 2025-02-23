import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
// This component represents the organization onboarding form.
// It includes multiple steps for collecting information about the organization.

import OrgDetails from '../components/OnboardingFormComponents/OrgDetails';
// import OrgLogo from '../components/OnboardingFormComponents/OrgLogo';
import MissionStatement from '../components/OnboardingFormComponents/MissionStatement';
import ContactInfo from '../components/OnboardingFormComponents/ContactInfo';
import OrgAddress from '../components/OnboardingFormComponents/OrgAddress';
// import CoverImageUpload from '../components/OnboardingFormComponents/OrgCoverImg';
import SocialMediaLinks from '../components/OnboardingFormComponents/SocialMediaLinks';

import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';

const CustomAlert = ({ message, onClose }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
        </span>
    </div>
);

const OnboardingForm = () => {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const apiClient = useApi();
    const { getUserId } = useAuth();
    const userId = getUserId();

    // refs for all form sections
    const orgDetailsRef = useRef();
    const missionStatementRef = useRef();
    // const logoRef = useRef();
    // const coverImageRef = useRef();
    const contactInfoRef = useRef();
    const addressRef = useRef();
    const socialMediaRef = useRef();

    const checkRedirect = async () => {
        const profileResponse = await apiClient.get(`/profile/load_org?user_id=${userId}`);
        if (profileResponse.ok && profileResponse.body) {
            navigate('/');
        }
    };

    useEffect(() => {
        checkRedirect();
    }, []);

    // Function to collect data from each component
    const collectAllData = () => {
        const formData = {
            "Organization Details": orgDetailsRef.current?.getData(),
            "Mission Statement": missionStatementRef.current?.getData(),
            // "Logo": logoRef.current?.getData(),
            // "Cover Image": coverImageRef.current?.getData(),
            "Contact Info": contactInfoRef.current?.getData(),
            "Address": addressRef.current?.getData(),
            "Social Media": socialMediaRef.current?.getData()
        };

        // Check if any section returned null (validation failed)
        for (const [section, data] of Object.entries(formData)) {
            if (!data) {
                setError(`Please check the ${section} section for errors`);
                return null;
            }
        }

        return formData;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);

    const formData = collectAllData();
        if (!formData) {
            setIsSubmitting(false);
            return;
        }

        const completeFormData = {
            user_id: userId,
            ...formData
        };

        try {
            console.log('completeFormData:', completeFormData);
            const response = await apiClient.post('/profile/org', completeFormData);
            if (response.status === 201) {
                const orgId = response.body.org_id;
                if (!orgId) {
                    throw new Error('Organization ID not received from the server');
                }

                navigate('/org_profile_form', { 
                    state: { 
                        userId: userId,
                        orgId: orgId,
                    } 
                });
            }
        } catch (error) {
            setError('An error occurred while submitting the form. Please try again.');
            console.error('Error sending form data to the backend:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-teal-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                            Organization Profile
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-medium text-gray-900 mb-6">Organization Details</h3>
                                <OrgDetails ref={orgDetailsRef} />
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-medium text-gray-900 mb-6">Mission Statement</h3>
                                <MissionStatement ref={missionStatementRef} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-medium text-gray-900 mb-6">Contact Information</h3>
                                    <ContactInfo ref={contactInfoRef} />
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-medium text-gray-900 mb-6">Address</h3>
                                    <OrgAddress ref={addressRef} />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-medium text-gray-900 mb-6">Social Media Links</h3>
                                <SocialMediaLinks ref={socialMediaRef} />
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-medium text-gray-900 mb-6">Logo</h3>
                                    <OrgLogo ref={logoRef} />
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-medium text-gray-900 mb-6">Cover Image</h3>
                                    <CoverImageUpload ref={coverImageRef} />
                                </div>
                            </div> */}

                            {error && <CustomAlert message={error} onClose={() => setError(null)} />}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                                    <Save className="ml-2 h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingForm;
