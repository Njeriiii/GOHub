import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

import ProgramInitiativesList from '../components/OrgProfileFormComponents/ProgramsInitiatives';
import PreviousProjectsList from '../components/OrgProfileFormComponents/PreviousProjects';
import OngoingProjectsList from '../components/OrgProfileFormComponents/OngoingProjects';
import SupportNeeds from '../components/OrgProfileFormComponents/SupportNeeds';

import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';

const CustomAlert = ({ message, onClose }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
    </div>
);

const steps = [
    { name: 'Programs & Initiatives', component: ProgramInitiativesList },
    { name: 'Previous Projects', component: PreviousProjectsList },
    { name: 'Ongoing Projects', component: OngoingProjectsList },
    { name: 'Support Needs', component: SupportNeeds },
];

const OrgProfileForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [formHeight, setFormHeight] = useState('auto');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const apiClient = useApi();
    const { getUserId } = useAuth();
    const location = useLocation();

    const refs = useRef(steps.map(() => React.createRef()));
    const formRef = useRef(null);

    // Get the userId from the API context
    const userId = getUserId();

    // useEffect(() => {
    //     if (location.state && location.state.userId) {
    //         setUserId(location.state.userId);
    //     } else {
    //         setUserId(2); // temporary userId for testing
    //     }
    // }, [location]);

    useEffect(() => {
        const updateFormHeight = () => {
            if (formRef.current) {
                const windowHeight = window.innerHeight;
                const formTop = formRef.current.getBoundingClientRect().top;
                const newHeight = windowHeight - formTop - 40; // 40px for some bottom margin
                setFormHeight(`${newHeight}px`);
            }
        };
    
        updateFormHeight();
        window.addEventListener('resize', updateFormHeight);
    
        return () => window.removeEventListener('resize', updateFormHeight);
    }, []);

    const collectDataFromCurrentStep = () => {
        const currentStepData = refs.current[currentStep].current?.getData();
        if (currentStepData) {
            setFormData(prevData => ({
                ...prevData,
                [steps[currentStep].name]: currentStepData
            }));
        }
    };

    const handleNext = (event) => {
        event.preventDefault();
        collectDataFromCurrentStep();
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = (event) => {
        event.preventDefault();
        collectDataFromCurrentStep();
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);

        collectDataFromCurrentStep();

        const completeFormData = {
            user_id: userId,
            ...formData
        };

        console.log('Submitting form data:', completeFormData);

        try {
            const response = await apiClient.post('/profile/org/projects_initiatives', completeFormData);
            if (response.status === 201) {
                navigate('/org_profile', { state: { userId } });
            }
        } catch (error) {
            setError('An error occurred while submitting the form. Please try again.');
            console.error('Error sending form data to the backend:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = (step, index) => {
        const StepComponent = step.component;
        return <StepComponent ref={refs.current[index]} />;
    };

    return (
        <div className="relative py-3 sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
            <div className="relative px-6 py-12 bg-white shadow-lg sm:rounded-3xl sm:p-24">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-center mb-6">Organization Profile</h2>
                    
                    {/* Progress bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        index <= currentStep ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 w-16 sm:w-24 ${
                                            index < currentStep ? 'bg-teal-600' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} ref={formRef} style={{ height: formHeight, overflowY: 'auto' }}>
                        {renderStepContent(steps[currentStep], currentStep)}

                        {error && <CustomAlert message={error} onClose={() => setError(null)} />}

                        <div className="mt-8 flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                                currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Previous
                            </button>
                            {currentStep < steps.length - 1 ? (
                                <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                >
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                                <Save className="ml-2 h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrgProfileForm;