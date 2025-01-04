import React, { forwardRef, useRef, useState } from 'react';
import { Translate } from '../../contexts/TranslationProvider';
import SupportNeeds from '../OrgProfileFormComponents/SupportNeeds';
import EditSection from './EditSection';
import { techSkillOptions, nonTechSkillOptions } from '../utils/supportNeedsFocusAreaEntries';
import { useApi } from '../../contexts/ApiProvider';
import ApiClient from '../../ApiClient';
/**
 * EditSupportNeeds component for managing organization's required skills
 * @param {Object} props
 * @param {Object} props.formData - Original form data
 * @param {boolean} props.isEditing - Whether the section is in edit mode
 * @param {Function} props.onEdit - Callback when editing begins
 * @param {Function} props.onSaveComplete - Callback when save is complete
 * @param {Function} props.onCancel - Callback when editing is cancelled
 * @param {Function} props.setLocalData - Function to update local state
 */
const EditSupportNeeds = forwardRef(({ 
    formData,
    isEditing,
    onEdit,
    onSaveComplete,
    onCancel,
    setLocalData
}, ref) => {
    const supportNeedsRef = useRef();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const apiClient = useApi();

    /**
     * Validates skills data before saving
     * @param {Object} skillsData - Skills data to validate
     * @returns {string|null} Error message if invalid, null if valid
     */
    const validateSkills = (skillsData) => {
        if (!skillsData) return 'Invalid skills data';
        if (!Array.isArray(skillsData.techSkills)) return 'Invalid technical skills format';
        if (!Array.isArray(skillsData.nonTechSkills)) return 'Invalid non-technical skills format';

        // Validate technical skills
        for (const skill of skillsData.techSkills) {
            if (!skill.value || typeof skill.value !== 'string') {
                return 'Invalid technical skill value';
            }
            if (!techSkillOptions.some(option => option.value === skill.value)) {
                return `Invalid technical skill: ${skill.value}`;
            }
            if (skill.description && typeof skill.description !== 'string') {
                return 'Invalid technical skill description format';
            }
        }

        // Validate non-technical skills
        for (const skill of skillsData.nonTechSkills) {
            if (!skill.value || typeof skill.value !== 'string') {
                return 'Invalid non-technical skill value';
            }
            if (!nonTechSkillOptions.some(option => option.value === skill.value)) {
                return `Invalid non-technical skill: ${skill.value}`;
            }
            if (skill.description && typeof skill.description !== 'string') {
                return 'Invalid non-technical skill description format';
            }
        }

        return null;
    };

    /**
     * Handles the save operation for skills
     */
    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);

            // Get data from SupportNeeds component
            const skillsData = supportNeedsRef.current.getData();
            
            // Validate the data
            const validationError = validateSkills(skillsData);
            if (validationError) {
                throw new Error(validationError);
            }

            // Transform the data to match the API format
            const transformedSkills = [
                ...skillsData.techSkills.map(skill => ({
                    skill: skill.value,
                    status: 'tech',
                    description: skill.description || ''
                })),
                ...skillsData.nonTechSkills.map(skill => ({
                    skill: skill.value,
                    status: 'non-tech',
                    description: skill.description || ''
                }))
            ];

            console.log('Saving skills:', transformedSkills);

            // // Make API call to save skills
            // const response = await apiClient.post('/profile/edit_skills', transformedSkills);

            // if (!response.ok) {
            //     const data = await response.json();
            //     throw new Error(data.message || 'Failed to save skills');
            // }

            // Update local data
            setLocalData(prevData => ({
                ...prevData,
                orgSkillsNeeded: transformedSkills
            }));

            // Notify parent of successful save
            onSaveComplete('skills');

        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Renders a skill badge with appropriate styling
     */
    const SkillBadge = ({ skill, type }) => {
        const options = type === 'tech' ? techSkillOptions : nonTechSkillOptions;
        const baseClasses = "px-3 py-1 rounded-full text-sm inline-block mr-2 mb-2";
        const colorClasses = type === 'tech' 
            ? "bg-blue-50 text-blue-700" 
            : "bg-green-50 text-green-700";

        return (
            <div className={`${baseClasses} ${colorClasses}`}>
                {options.find(option => option.value === skill.skill)?.label || skill.skill}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <EditSection
                title={<Translate>Skills Needed</Translate>}
                isEditing={isEditing}
                onEdit={onEdit}
                onSave={handleSave}
                onCancel={() => {
                    setError(null);
                    onCancel();
                }}
                isSaving={isSaving}
            >
                <div className="space-y-6">
                    {/* Always Visible Skills Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                                <Translate>Technical Skills</Translate>
                            </h4>
                            <div className="flex flex-wrap">
                                {formData.orgSkillsNeeded
                                    .filter(skill => skill.status === 'tech')
                                    .map(skill => (
                                        <SkillBadge 
                                            key={skill.id} 
                                            skill={skill} 
                                            type="tech" 
                                        />
                                    ))
                                }
                                {formData.orgSkillsNeeded.filter(skill => skill.status === 'tech').length === 0 && (
                                    <p className="text-gray-500 italic text-sm">
                                        <Translate>No technical skills specified</Translate>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                                <Translate>Non-Technical Skills</Translate>
                            </h4>
                            <div className="flex flex-wrap">
                                {formData.orgSkillsNeeded
                                    .filter(skill => skill.status === 'non-tech')
                                    .map(skill => (
                                        <SkillBadge 
                                            key={skill.id} 
                                            skill={skill} 
                                            type="non-tech" 
                                        />
                                    ))
                                }
                                {formData.orgSkillsNeeded.filter(skill => skill.status === 'non-tech').length === 0 && (
                                    <p className="text-gray-500 italic text-sm">
                                        <Translate>No non-technical skills specified</Translate>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Editing Section */}
                    {isEditing && (
                        <SupportNeeds
                            ref={supportNeedsRef}
                            initialTechSkills={formData.orgSkillsNeeded
                                .filter(skill => skill.status === 'tech')
                                .map(skill => ({
                                    value: skill.skill,
                                    label: techSkillOptions.find(option => option.value === skill.skill)?.label || skill.skill,
                                    description: skill.description
                                }))}
                            initialNonTechSkills={formData.orgSkillsNeeded
                                .filter(skill => skill.status === 'non-tech')
                                .map(skill => ({
                                    value: skill.skill,
                                    label: nonTechSkillOptions.find(option => option.value === skill.skill)?.label || skill.skill,
                                    description: skill.description
                                }))}
                        />
                    )}
                </div>
            </EditSection>
        </div>
    );
});

export default EditSupportNeeds;
