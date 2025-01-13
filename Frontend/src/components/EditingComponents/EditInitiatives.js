import React, { useRef, useState } from 'react';
import EditSection from './EditSection';
import ProgramInitiativesList from '../OrgProfileFormComponents/ProgramsInitiatives';
import { Translate } from '../../contexts/TranslationProvider';
import { useApi } from '../../contexts/ApiProvider';

/**
 * EditInitiatives component for managing organization's programs and initiatives
 * @param {Object} props
 * @param {Object} props.formData - Original form data
 * @param {Object} props.localData - Current local state
 * @param {Function} props.setLocalData - Function to update local state
 * @param {boolean} props.isEditing - Whether the section is in edit mode
 * @param {Function} props.onEdit - Callback when editing begins
 * @param {Function} props.onSaveComplete - Callback when save is complete
 * @param {Function} props.onCancel - Callback when editing is cancelled
 */
const EditInitiatives = ({
    formData,
    localData,
    setLocalData,
    isEditing,
    onEdit,
    onSaveComplete,
    onCancel,
}) => {
    const initiativesListRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const apiClient = useApi();

    /**
     * Updates the local state when initiatives are modified
     * @param {Array} updatedInitiatives - New array of initiatives
     */
    const handleInitiativesChange = (updatedInitiatives) => {
        setLocalData({
            ...localData,
            orgInitiatives: updatedInitiatives
        });
    };

    /**
     * Validates initiatives data before saving
     * @param {Array} initiatives - Array of initiative objects to validate
     * @returns {boolean} - Whether the data is valid
     */
    const validateInitiatives = (initiatives) => {
        if (!Array.isArray(initiatives)) return false;
        
        return initiatives.every(initiative => 
            initiative &&
            typeof initiative.initiative_name === 'string' && 
            initiative.initiative_name.trim() !== '' &&
            typeof initiative.initiative_description === 'string' &&
            initiative.initiative_description.trim() !== ''
        );
    };

    /**
     * Handles the save operation for initiatives
     */
    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);

            // Get current initiatives data
            const initiatives = localData.orgInitiatives;

            // Validate the data
            if (!validateInitiatives(initiatives)) {
                throw new Error('Please ensure all initiatives have a name and description');
            }
    
            // Prepare initiatives data
            const initiativesToSave = initiatives.map(initiative => ({
                ...initiative,
                org_id: formData.orgProfile.id,
                user_id: formData.orgProfile.user_id
            }));
    
            console.log('Saving initiatives:', initiativesToSave);
    
            // Make API call to save initiatives
            // Add request debugging
            try {
                const response = await apiClient.post('/profile/edit_initiatives', initiativesToSave);
                console.log('Response:', response);
            } catch (err) {
                console.error('API Error:', err);
                throw err;
            }
    
            // Update local state
            setLocalData({
                ...localData,
                orgInitiatives: initiativesToSave
            });
    
            onSaveComplete();

        } catch (err) {
            setError(err.message);
            // Keep the edit mode active when there's an error
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handles cancelling the edit operation
     */
    const handleCancel = () => {
        setError(null);
        onCancel();
    };

    return (
        <div className="space-y-4">
            <EditSection
                title={<Translate>Programs & Initiatives</Translate>}
                isEditing={isEditing}
                onEdit={onEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
            >
                {isEditing ? (
                    <ProgramInitiativesList
                        ref={initiativesListRef}
                        initialInitiatives={localData.orgInitiatives}
                        onInitiativesChange={handleInitiativesChange}
                        hideTitle={true}
                    />
                ) : (
                    <div className="space-y-6">
                        {localData.orgInitiatives.length === 0 ? (
                            <p className="text-gray-500 italic">
                                <Translate>No programs or initiatives added yet</Translate>
                            </p>
                        ) : (
                            localData.orgInitiatives.map((initiative) => (
                                <div 
                                    key={initiative.id} 
                                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                >
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                        {initiative.initiative_name}
                                    </h4>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {initiative.initiative_description}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </EditSection>
        </div>
    );
};

export default EditInitiatives;