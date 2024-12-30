import React from 'react';
import { Translate } from '../../contexts/TranslationProvider';
import { 
    PencilIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
// Section wrapper component
export default function EditSection({ 
    title, 
    children, 
    isEditing, 
    onEdit, 
    onSave, 
    onCancel,
    showEditButton = true 
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {showEditButton && !isEditing && (
                    <button
                        onClick={onEdit}
                        className="text-teal-600 hover:text-teal-700 flex items-center gap-2"
                    >
                        <PencilIcon className="h-4 w-4" />
                        <Translate>Edit</Translate>
                    </button>
                )}
            </div>
            {children}
            {isEditing && (
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onCancel}
                        className="flex items-center px-3 py-2 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        <Translate>Cancel</Translate>
                    </button>
                    <button
                        onClick={onSave}
                        className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700"
                    >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        <Translate>Save Changes</Translate>
                    </button>
                </div>
            )}
        </div>
    );
}
