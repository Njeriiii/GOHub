import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import CreatableSelect from "react-select/creatable";
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';

// This component represents the volunteer form page.
// It allows volunteers to submit their technical and non-technical skills.
const VolunteerForm = () => {
    const [techSkills, setTechSkills] = useState([]);
    const [nonTechSkills, setNonTechSkills] = useState([]);
    const navigate = useNavigate();
    const apiClient = useApi();
    const { getUserId } = useAuth();

    // Get the userId from the API context
    const userId = getUserId();

    const techSkillOptions = [
        { value: 'webdevelopment', label: 'Web Development' },
        { value: 'photography', label: 'Photography' },
        { value: 'graphicdesign', label: 'Graphic Design' },
        { value: 'dataanalysis', label: 'Data Analysis' },
        { value: 'videoproduction', label: 'Video Production' },
        { value: 'digitalmarketing', label: 'Digital Marketing' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: '3dmodeling', label: '3D Modeling' },
        { value: 'soundengineering', label: 'Sound Engineering' },
        { value: 'uxuidesign', label: 'UX/UI Design' },
    ];

    const nonTechSkillOptions = [
        { value: 'communication', label: 'Communication' },
        { value: 'leadership', label: 'Leadership' },
        { value: 'projectmanagement', label: 'Project Management' },
        { value: 'publicspeaking', label: 'Public Speaking' },
        { value: 'writing', label: 'Writing' },
        { value: 'teamwork', label: 'Teamwork' },
        { value: 'problemsolving', label: 'Problem Solving' },
        { value: 'timemanagement', label: 'Time Management' },
        { value: 'creativity', label: 'Creativity' },
        { value: 'customerservice', label: 'Customer Service' },
        { value: 'eventplanning', label: 'Event Planning' },
        { value: 'fundraising', label: 'Fundraising' },
        { value: 'mentoring', label: 'Mentoring' },
        { value: 'conflictresolution', label: 'Conflict Resolution' },
    ];

    const checkRedirect = async () => {
        // Check if a profile has been created
        const profileResponse = await apiClient.get(`/profile/load_org?user_id=${userId}`)
                
        if (profileResponse.ok && profileResponse.body) {
            // Profile exists, redirect to dashboard
            navigate('/');
        
        } else {

            // Check if a Volunteer profile has been created
            const profileResponse = await apiClient.get(`/profile/volunteer?user_id=${userId}`)
            
            // If the user is an admin, redirect to the onboarding page
            if (profileResponse.body.code === 403) {
                navigate('/onboarding');
            }

            if (profileResponse.ok && profileResponse.body.volunteer && profileResponse.body.volunteer.skills) {

                if (profileResponse.body.volunteer.skills.length > 0) {
                    // Profile exists, redirect to dashboard
                    navigate('/');
                } else {
                    // Profile does not exist, allow user to create one
                    return;
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert('User ID is missing. Please try logging in again.');
            return;
        }
    
        const data = { 
            userId, 
            techSkills: techSkills.map(skill => skill.value),
            nonTechSkills: nonTechSkills.map(skill => skill.value)
        };
    
        try {
            const response = await apiClient.post('/profile/volunteer', data);
        
            if (response.ok) {
            alert('Form submitted successfully!');
            setTechSkills([]);
            setNonTechSkills([]);
            // Optionally, navigate to a success page or dashboard
            navigate('/');
            } else {
                alert('Error submitting form. Please try again.');
            }
            } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            }
        };
    
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: '#d1d5db',
            '&:hover': { borderColor: '#9ca3af' },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0d9488' : state.isFocused ? '#e6fffa' : null,
            color: state.isSelected ? 'white' : '#111827',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e6fffa',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#0d9488',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#0d9488',
            ':hover': {
            backgroundColor: '#0d9488',
            color: 'white',
            },
            }),
        };

        // delay the redirect to allow the checkRedirect function to run
        // before the return statement
        checkRedirect();

            return (            
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Volunteer Information
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="tech-skills" className="block text-sm font-medium text-gray-700">
                        Technical Skills
                        </label>
                        <CreatableSelect
                        isMulti
                        onChange={setTechSkills}
                        options={techSkillOptions}
                        styles={customStyles}
                        className="mt-1"
                        placeholder="Select or create technical skills"
                        value={techSkills}
                        />
                    </div>
            
                    <div>
                        <label htmlFor="non-tech-skills" className="block text-sm font-medium text-gray-700">
                        Non-Technical Skills
                        </label>
                        <CreatableSelect
                        isMulti
                        onChange={setNonTechSkills}
                        options={nonTechSkillOptions}
                        styles={customStyles}
                        className="mt-1"
                        placeholder="Select or create non-technical skills"
                        value={nonTechSkills}
                        />
                    </div>
            
                    <div>
                        <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                        Submit
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            );
    };
export default VolunteerForm;