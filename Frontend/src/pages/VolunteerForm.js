import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import CreatableSelect from "react-select/creatable";
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';
import { nonTechSkillOptions, techSkillOptions } from '../components/utils/supportNeedsFocusAreaEntries';

const formatSkillsForSelect = (skills) => {
    return skills.map((skill) => ({
        value: skill.toLowerCase().replace(/\s+/g, ""),
        label:
            nonTechSkillOptions.find((option) => option.value === skill)?.label ||
            techSkillOptions.find((option) => option.value === skill)?.label ||
            skill,
    }));
};

// This component represents the volunteer form page.
// It allows volunteers to submit their technical and non-technical skills.
const VolunteerForm = ({ 
    isEditing = false,
    initialTechSkills = [],
    initialNonTechSkills = [],
    onCancel
}) => {
    const [techSkills, setTechSkills] = useState(
        isEditing ? formatSkillsForSelect(initialTechSkills) : []
    );
    const [nonTechSkills, setNonTechSkills] = useState(
        isEditing ? formatSkillsForSelect(initialNonTechSkills) : []
    );
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const apiClient = useApi();
    const { getUserId } = useAuth();

    // Get the userId from the API context
    const userId = getUserId();

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
        setIsLoading(true);
    
        const data = { 
            userId, 
            techSkills: techSkills.map(skill => skill.value),
            nonTechSkills: nonTechSkills.map(skill => skill.value)
        };
    
        try {
            const endpoint = isEditing ? '/profile/volunteer/edit' : '/profile/volunteer';
            const response = await apiClient.post(endpoint, data);
        
            if (response.ok) {
            alert('Form submitted successfully!');
                navigate('/volunteer');
            } else {
                alert('Error submitting form. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                setIsLoading(false);
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
        if (!isEditing) {
            checkRedirect();
        }
            return (            
                <div className="absolute inset-0 bg-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                <div className="bg-white rounded-lg p-8">
                    <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
                    {isEditing ? 'Edit Skills' : 'Volunteer Information'}
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
            
                    <div className="flex gap-4">
                        {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            Cancel
                        </button>
                    )}
                        <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                            isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        >
                        {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Submit')}
                        </button>
                    </div>
                    </form>
                </div>
                    </div>
                </div>
            );
    };
export default VolunteerForm;