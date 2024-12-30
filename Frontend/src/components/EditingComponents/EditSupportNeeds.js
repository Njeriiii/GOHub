import React, { forwardRef, useRef } from 'react';
import { Translate } from '../../contexts/TranslationProvider';
import SupportNeeds from '../OrgProfileFormComponents/SupportNeeds';
import EditSection from './EditSection';
import { techSkillOptions, nonTechSkillOptions } from '../utils/supportNeedsFocusAreaEntries';

const EditSupportNeeds = forwardRef(({ 
    formData,
    isEditing,
    onEdit,
    onSaveComplete, // New prop to notify parent of save completion
    onCancel,
    setLocalData // Pass down the setLocalData function
}, ref) => {
    const supportNeedsRef = useRef();

    const handleSave = async () => {
        try {
            // Get data from SupportNeeds component
            const skillsData = supportNeedsRef.current.getData();
            
            // Transform the data to match your existing format
            const transformedSkills = [
                ...skillsData.techSkills.map(skill => ({
                    skill: skill.value,
                    status: 'tech',
                    description: skill.description
                })),
                ...skillsData.nonTechSkills.map(skill => ({
                    skill: skill.value,
                    status: 'non-tech',
                    description: skill.description
                }))
            ];

            // Update local data
            setLocalData(prevData => ({
                ...prevData,
                orgSkillsNeeded: transformedSkills
            }));

            // API call would go here to save the specific section
            console.log('Saving skills section', transformedSkills);

            // Notify parent component that save is complete
            onSaveComplete('skills');

        } catch (error) {
            console.error('Error saving skills:', error);
        }
    };

    return (
        <div className="space-y-6">
            <EditSection
                title="Skills Needed"
                isEditing={isEditing}
                onEdit={onEdit}
                onSave={handleSave}
                onCancel={onCancel}
            >
                {/* Always Visible Skills Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            <Translate>Technical Skills</Translate>
                        </h4>
                        <div className="space-y-2">
                            {formData.orgSkillsNeeded
                                .filter(skill => skill.status === 'tech')
                                .map(skill => (
                                    <div 
                                        key={skill.id}
                                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block mr-2"
                                    >
                                        {techSkillOptions.find(option => option.value === skill.skill)?.label || skill.skill}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            <Translate>Non-Technical Skills</Translate>
                        </h4>
                        <div className="space-y-2">
                            {formData.orgSkillsNeeded
                                .filter(skill => skill.status === 'non-tech')
                                .map(skill => (
                                    <div 
                                        key={skill.id}
                                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm inline-block mr-2"
                                    >
                                        {nonTechSkillOptions.find(option => option.value === skill.skill)?.label || skill.skill}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
    
                {/* Additional Editing Section */}
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
            </EditSection>
        </div>
    );
});

export default EditSupportNeeds;
