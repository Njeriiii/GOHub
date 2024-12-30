import React, { forwardRef } from 'react';
import { Translate } from '../../contexts/TranslationProvider';
import EditSection from './EditSection';
import MissionStatement from '../OnboardingFormComponents/MissionStatement';

const EditMission = forwardRef(({
    formData,
    localData,
    setLocalData,
    isEditing,
    onEdit,
    onSave,
    onCancel,
}, ref) => {
    return (
        <div>
            <EditSection
                title="Mission"
                isEditing={isEditing}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
            >
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Translate>Mission Statement</Translate>
                            </label>
                            <MissionStatement
                                initialValue={localData.orgProfile.org_mission_statement}
                                onChange={(value) => setLocalData({
                                    ...localData,
                                    orgProfile: {
                                        ...localData.orgProfile,
                                        org_mission_statement: value
                                    }
                                })}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700">Mission Statement</h4>
                            <p className="mt-1 text-gray-600">{formData.orgProfile.org_mission_statement}</p>
                        </div>
                    </div>
                )}
            </EditSection>
        </div>
    );
});

export default EditMission;
