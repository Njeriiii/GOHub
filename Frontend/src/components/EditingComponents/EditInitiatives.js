import React, { useRef } from 'react';
import EditSection from './EditSection';
import ProgramInitiativesList from '../OrgProfileFormComponents/ProgramsInitiatives';
import { Translate } from '../../contexts/TranslationProvider';

const EditInitiatives = ({
    formData,
    localData,
    setLocalData,
    isEditing,
    onEdit,
    onSave,
    onCancel,
}) => {
    const initiativesListRef = useRef(null);

    const handleInitiativesChange = (updatedInitiatives) => {
        setLocalData({
            ...localData,
            orgInitiatives: updatedInitiatives
        });
    };

    return (
        <EditSection
            title="Programs & Initiatives"
            isEditing={isEditing}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
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
                    {formData.orgInitiatives.map((initiative) => (
                        <div key={initiative.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                {initiative.initiative_name}
                            </h4>
                            <p className="text-gray-600 whitespace-pre-line">
                                {initiative.initiative_description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </EditSection>
    );
};

export default EditInitiatives;