import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import CreatableSelect from "react-select/creatable";
import { useApi } from '../../contexts/ApiProvider';
import { techSkillOptions, nonTechSkillOptions } from '../utils/supportNeedsFocusAreaEntries';
// This component represents the support needs section of the organization onboarding form.
// It includes fields for technical and non-technical skills needed by the organization.

// Dynamic textarea component with auto-resize
const AutoResizeTextarea = ({ value, onChange, placeholder, name }) => {
    const textareaRef = useRef(null);
    const mirrorRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const mirror = mirrorRef.current;

        if (textarea && mirror) {
            // Copy styles to mirror
            const styles = window.getComputedStyle(textarea);
            mirror.style.width = styles.width;
            mirror.style.padding = styles.padding;
            mirror.style.borderStyle = styles.borderStyle;
            mirror.style.borderWidth = styles.borderWidth;
            mirror.style.boxSizing = styles.boxSizing;
            mirror.style.fontFamily = styles.fontFamily;
            mirror.style.fontSize = styles.fontSize;
            
            // Set mirror content and adjust height
            mirror.textContent = value || placeholder;
            textarea.style.height = `${mirror.scrollHeight}px`;
        }
    }, [value, placeholder]);

    return (
        <div className="relative w-full">
            <textarea
                ref={textareaRef}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={1}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 resize-none overflow-hidden"
                style={{ 
                    minHeight: '100px',
                    height: 'auto',
                    overflow: 'hidden'
                }}
            />
            <div 
                ref={mirrorRef} 
                className="absolute left-[-9999px] top-0 whitespace-pre-wrap break-words"
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                    wordWrap: 'break-word'
                }}
            />
        </div>
    );
};

const fetchSkills = async (apiClient) => {
    try {
        // Query db for tech and non-tech skills
        const response = await apiClient.get('/all_skills');

        let skills = [];
        if (response.status === 200) {
            skills = response.body.skills;
        }

        // Combine queried skills with predefined skills
        const combinedTechSkills = [
            ...skills.filter(skill => skill.status === 'tech'),
            ...techSkillOptions
        ];
        console.log('combinedTechSkills:', combinedTechSkills);

        const combinedNonTechSkills = [
            ...skills.filter(skill => skill.status === 'non-tech'),
            ...nonTechSkillOptions
        ];

        const techSkillList = [
            ...new Set(
                combinedTechSkills
                    .map(skill => skill.value) // Extract skill values
                    .filter(skillValue => typeof skillValue === "string" && skillValue.trim() !== "") // Keep only valid non-empty strings
            )
        ].map(skillValue => {
        
            const existingSkill = techSkillOptions.find(s => s.value === skillValue);        
            return existingSkill || { 
                value: skillValue, 
                label: skillValue.charAt(0).toUpperCase() + skillValue.slice(1) 
            };
        });

        const nonTechSkillList = [
            ...new Set(
                ...combinedNonTechSkills
                .map(skill => skill.value)
                .filter(skillValue => typeof skillValue === "string" && skillValue.trim() !== "") // Keep only valid non-empty strings
            )
        ].map(skillValue => {
            const existingSkill = nonTechSkillOptions.find(s => s.value === skillValue);
            return existingSkill || { 
                value: skillValue, 
                label: skillValue.charAt(0).toUpperCase() + skillValue.slice(1) 
            };
        });

        return { techSkillList, nonTechSkillList };
    } catch (error) {
        console.error('Error fetching skills:', error);
        
        // Fallback to predefined skills if API call fails
        return {
            techSkillList: techSkillOptions,
            nonTechSkillList: nonTechSkillOptions
        };
    }
};

const SupportNeeds = forwardRef((props, ref) => {
    const [techSkills, setTechSkills] = useState([]);
    const [techSkillsOptions, setTechSkillOptions] = useState([]);
    const [nonTechSkills, setNonTechSkills] = useState([]);
    const [nonTechSkillsOptions, setNonTechSkillOptions] = useState([]);
    const [needVolunteers, setNeedVolunteers] = useState(false);
    const apiClient = useApi();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const skills = await fetchSkills(apiClient);
                
                setTechSkillOptions(skills.techSkillList);
                setNonTechSkillOptions(skills.nonTechSkillList);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };
        
        fetchData();
    }, [apiClient]);

    const handleVolunteerCheck = (event) => {
        setNeedVolunteers(event.target.checked);
    };

    const handleTechSkillChange = (newSelectedSkills) => {
        setTechSkills(prevSkills => {
            // Create a map of existing skills by their value
            const existingSkillsMap = new Map(prevSkills.map(skill => [skill.value, skill]));
    
            // Map new skills, preserving existing descriptions if available
            return newSelectedSkills.map(skill => ({
                ...skill,
                description: existingSkillsMap.get(skill.value)?.description || ''
            }));
        });
    };
    
    const handleNonTechSkillChange = (newSelectedSkills) => {
        setNonTechSkills(prevSkills => {
            // Create a map of existing skills by their value
            const existingSkillsMap = new Map(prevSkills.map(skill => [skill.value, skill]));
    
            // Map new skills, preserving existing descriptions if available
            return newSelectedSkills.map(skill => ({
                ...skill,
                description: existingSkillsMap.get(skill.value)?.description || ''
            }));
        });
    };

    const handleSkillDescriptionChange = (index, description, istech) => {
        if (istech) {
            const newTechSkills = [...techSkills];
            newTechSkills[index].description = description;
            setTechSkills(newTechSkills);
        } else {
            const newNonTechSkills = [...nonTechSkills];
            newNonTechSkills[index].description = description;
            setNonTechSkills(newNonTechSkills);
        }
    };

    const getData = () => {
        return { techSkills, nonTechSkills };
    }

    useImperativeHandle(ref, () => ({ getData }));

    return (
        <div>
            <div className="mb-8 my-6 ">
                <input
                    type="checkbox"
                    checked={needVolunteers}
                    onChange={handleVolunteerCheck}
                    className="checked:bg-teal-500 checked:border-transparent bg-gray-100 border border-gray-300 rounded focus:ring focus:ring-offset-2 focus:ring-teal-500 size-10"
                />
                <label className='text-2xl font-semibold'> We would like Volunteers</label>
            </div>
            {needVolunteers && (
                <div>
                    <div className="mb-4">
                        <label>Technical Skills Needed:</label>
                        <CreatableSelect
                            id="techSkills"
                            isMulti
                            options={techSkillsOptions}
                            value={techSkills}
                            onChange={handleTechSkillChange}
                            placeholder="Select or type to add"
                        />
                        {techSkills.map((skill, index) => (
                            <div key={index} className="mt-2">
                                <label>{skill.label} Description:</label>
                                <AutoResizeTextarea
                                    value={skill.description}
                                    onChange={(e) => handleSkillDescriptionChange(index, e.target.value, true)}
                                    placeholder={`Describe what you need`}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="mb-4">
                        <label>Non-Technical Skills Needed:</label>
                        <CreatableSelect
                            id="nonTechSkills"
                            isMulti
                            options={nonTechSkillsOptions}
                            value={nonTechSkills}
                            onChange={handleNonTechSkillChange}
                            placeholder="Select or type to add"
                        />
                        {nonTechSkills.map((skill, index) => (
                            <div key={index} className="mt-2">
                                <label>{skill.label} Description:</label>
                                <AutoResizeTextarea
                                    value={skill.description}
                                    onChange={(e) => handleSkillDescriptionChange(index, e.target.value, false)}
                                    placeholder={`Describe what you need`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default SupportNeeds;