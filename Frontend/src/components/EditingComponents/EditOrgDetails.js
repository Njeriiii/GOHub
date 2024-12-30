import React, {useEffect, useRef} from 'react';
import EditSection from './EditSection';

const EditDetails = ({
    formData,
    localData,
    setLocalData,
    isEditing,
    onEdit,
    onSave,
    onCancel,
}) => {
    const textAreaRef = useRef(null);

    const adjustTextAreaHeight = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = 'auto';
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextAreaHeight();
    }, [localData.orgProfile.org_overview]);

    useEffect(() => {
        window.addEventListener('resize', adjustTextAreaHeight);
        return () => window.removeEventListener('resize', adjustTextAreaHeight);
    }, []);

    const handleOverviewChange = (e) => {
        const value = e.target.value;
        if (value.length <= 200) {  // Character limit
            setLocalData({
                ...localData,
                orgProfile: {
                    ...localData.orgProfile,
                    org_overview: value
                }
            });
        }
    };

    return (
        <EditSection
            title="Organization Overview"
            isEditing={isEditing}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            {isEditing ? (
                <div className="p-6">
                    <textarea
                        ref={textAreaRef}
                        value={localData.orgProfile.org_overview}
                        onChange={handleOverviewChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm 
                                focus:border-teal-500 focus:ring-teal-500 sm:text-base 
                                min-h-[100px] transition-height duration-200"
                        placeholder="Provide a brief description of your organization"
                        maxLength={200}
                        style={{ resize: 'none', overflow: 'hidden' }}
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                        {localData.orgProfile.org_overview.length}/200
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600">{formData.orgProfile.org_overview}</p>
                </div>
            )}
        </EditSection>
    );
};

export default EditDetails;
