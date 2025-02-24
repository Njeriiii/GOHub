import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import CreatableSelect from "react-select/creatable";
import { useApi } from '../../contexts/ApiProvider';
import { techSkillOptions, nonTechSkillOptions } from '../utils/supportNeedsFocusAreaEntries';
import { XCircleIcon } from '@heroicons/react/24/outline';
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
                className="w-full rounded-md border border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 resize-none overflow-hidden"
                style={{ 
                    minHeight: '100px',
                    height: 'auto',
                    overflow: 'hidden'
                }}
            />
            <div 
                ref={mirrorRef} 
                className="absolute left-[-9999px] top-0 whitespace-pre-wrap break-words"
                aria-hidden="true"
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                    wordWrap: 'break-word'
                }}
            />
        </div>
    );
};

const SupportNeeds = forwardRef(({ initialTechSkills = [], initialNonTechSkills = [] }, ref) => {
    // State for current skills
    const [techSkills, setTechSkills] = useState(initialTechSkills);
    const [nonTechSkills, setNonTechSkills] = useState(initialNonTechSkills);
    
    // State for available options
    const [techSkillsOptions, setTechSkillOptions] = useState([]);
    const [nonTechSkillsOptions, setNonTechSkillOptions] = useState([]);
    
    // State for tracking original skills (for comparison)
    const [originalTechSkills] = useState(new Set(initialTechSkills.map(skill => skill.value)));
    const [originalNonTechSkills] = useState(new Set(initialNonTechSkills.map(skill => skill.value)));
    
    const [needVolunteers, setNeedVolunteers] = useState(
        initialTechSkills.length > 0 || initialNonTechSkills.length > 0
    );
    
    const apiClient = useApi();

    // Fetch available skills on component mount
    useEffect(() => {
        const fetchSkillOptions = async () => {
            try {
                const response = await apiClient.get('/all_skills');
                const skills = response.ok ? response.body.skills : [];

                // Combine and deduplicate skills
                const techList = Array.from(new Set([
                    ...(skills?.filter(s => s?.status === 'tech')?.map(s => s?.value) || []),
                    ...(techSkillOptions?.map(s => s?.value) || [])
                ]))
                .filter(value => value) // Remove any undefined/null values
                .map(value => ({
                    value,
                    label: value.charAt(0).toUpperCase() + value.slice(1)
                }));

                const nonTechList = Array.from(new Set([
                    ...(skills?.filter(s => s?.status === 'non-tech')?.map(s => s?.value) || []),
                    ...(nonTechSkillOptions?.map(s => s?.value) || [])
                ]))
                .filter(value => value) // Remove any undefined/null values
                .map(value => ({
                    value,
                    label: value.charAt(0).toUpperCase() + value.slice(1)
                }));

                setTechSkillOptions(techList);
                setNonTechSkillOptions(nonTechList);
            } catch (error) {
                console.error('Error fetching skills:', error);
                // Fallback to predefined options
                setTechSkillOptions(techSkillOptions);
                setNonTechSkillOptions(nonTechSkillOptions);
            }
        };

        fetchSkillOptions();
    }, [apiClient]);

    const handleVolunteerCheck = (event) => {
        const newValue = event.target.checked;
        setNeedVolunteers(newValue);
        if (!newValue) {
            setTechSkills([]);
            setNonTechSkills([]);
        }
    };

    const handleTechSkillChange = (newSkills) => {
        setTechSkills(prevSkills => {
            const existingSkills = new Map(prevSkills.map(skill => [skill.value, skill]));
            return newSkills.map(skill => ({
                ...skill,
                description: existingSkills.get(skill.value)?.description || ''
            }));
        });
    };

    const handleNonTechSkillChange = (newSkills) => {
        setNonTechSkills(prevSkills => {
            const existingSkills = new Map(prevSkills.map(skill => [skill.value, skill]));
            return newSkills.map(skill => ({
                ...skill,
                description: existingSkills.get(skill.value)?.description || ''
            }));
        });
    };

    const handleSkillDescriptionChange = (index, description, istech) => {
        if (istech) {
            setTechSkills(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], description };
                return updated;
            });
        } else {
            setNonTechSkills(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], description };
                return updated;
            });
        }
    };

    const removeSkill = (index, istech) => {
        if (istech) {
            setTechSkills(prev => prev.filter((_, i) => i !== index));
        } else {
            setNonTechSkills(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Expose data and change tracking methods
    useImperativeHandle(ref, () => ({
        getData: () => ({ 
            techSkills, 
            nonTechSkills,
            // Track which skills were removed from the original set
            removedSkills: {
                tech: Array.from(originalTechSkills).filter(
                    skill => !techSkills.some(s => s.value === skill)
                ),
                nonTech: Array.from(originalNonTechSkills).filter(
                    skill => !nonTechSkills.some(s => s.value === skill)
                )
            }
        }),
        hasChanges: () => {
            const currentTechSet = new Set(techSkills.map(s => s.value));
            const currentNonTechSet = new Set(nonTechSkills.map(s => s.value));
            return !setsEqual(currentTechSet, originalTechSkills) || 
                    !setsEqual(currentNonTechSet, originalNonTechSkills);
        }
    }));

    // Utility function to compare sets
    const setsEqual = (a, b) => 
        a.size === b.size && [...a].every(value => b.has(value));

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    checked={needVolunteers}
                    onChange={handleVolunteerCheck}
                    className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    id="volunteerNeeded"
                />
                <label 
                    htmlFor="volunteerNeeded"
                    className="text-lg font-medium text-gray-900"
                >
                    We would like Volunteers
                </label>
            </div>

            {needVolunteers && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Technical Skills Needed:
                        </label>
                        <CreatableSelect
                            isMulti
                            options={techSkillsOptions}
                            value={techSkills}
                            onChange={handleTechSkillChange}
                            placeholder="Select or type to add technical skills"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                        <div className="space-y-4">
                            {techSkills.map((skill, index) => (
                                <div key={index} className="relative p-4 border rounded-lg bg-gray-50">
                                    <button
                                        onClick={() => removeSkill(index, true)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        aria-label="Remove skill"
                                    >
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {skill.label} Description:
                                    </label>
                                    <AutoResizeTextarea
                                        value={skill.description}
                                        onChange={(e) => handleSkillDescriptionChange(index, e.target.value, true)}
                                        placeholder={'Describe what you need for this skill'}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Non-Technical Skills Needed:
                        </label>
                        <CreatableSelect
                            isMulti
                            options={nonTechSkillsOptions}
                            value={nonTechSkills}
                            onChange={handleNonTechSkillChange}
                            placeholder="Select or type to add non-technical skills"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                        <div className="space-y-4">
                            {nonTechSkills.map((skill, index) => (
                                <div key={index} className="relative p-4 border rounded-lg bg-gray-50">
                                    <button
                                        onClick={() => removeSkill(index, false)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        aria-label="Remove skill"
                                    >
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {skill.label} Description:
                                    </label>
                                    <AutoResizeTextarea
                                        value={skill.description}
                                        onChange={(e) => handleSkillDescriptionChange(index, e.target.value, false)}
                                        placeholder={'Describe what you need for this skill'}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default SupportNeeds;