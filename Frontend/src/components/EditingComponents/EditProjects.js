import React from 'react';
import { Translate } from '../../contexts/TranslationProvider';
import EditSection from './EditSection';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const EditProjects = ({
    formData,
    localData,
    setLocalData,
    isEditing,
    onEdit,
    onSave,
    onCancel,
}) => {
    // Handle adding a new project
    const handleAddProject = () => {
        setLocalData({
            ...localData,
            orgProjects: [
                ...localData.orgProjects,
                {
                    project_name: '',
                    project_description: '',
                    project_status: 'ongoing',
                    org_id: formData.orgProfile.id
                }
            ]
        });
    };

    // Handle removing a project
    const handleRemoveProject = (index) => {
        const newProjects = localData.orgProjects.filter((_, i) => i !== index);
        setLocalData({
            ...localData,
            orgProjects: newProjects
        });
    };

    // Handle updating a project field
    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...localData.orgProjects];
        updatedProjects[index] = {
            ...updatedProjects[index],
            [field]: value
        };
        setLocalData({
            ...localData,
            orgProjects: updatedProjects
        });
    };

    // Get status badge classes
    const getStatusBadgeClasses = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full ";
        switch (status) {
            case 'completed':
                return baseClasses + 'bg-green-100 text-green-800';
            case 'ongoing':
                return baseClasses + 'bg-blue-100 text-blue-800';
            default:
                return baseClasses + 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <EditSection
            title="Projects"
            isEditing={isEditing}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            {isEditing ? (
                <div className="space-y-6">
                    {localData.orgProjects.map((project, index) => (
                        <div key={project.id || index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between mb-4">
                                <h4 className="text-lg font-medium text-gray-900">
                                    <Translate>Project {index + 1}</Translate>
                                </h4>
                                <button
                                    onClick={() => handleRemoveProject(index)}
                                    className="text-red-600 hover:text-red-700"
                                    type="button"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Project Name</Translate>
                                    </label>
                                    <input
                                        type="text"
                                        value={project.project_name}
                                        onChange={(e) => handleProjectChange(index, 'project_name', e.target.value)}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Description</Translate>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={project.project_description}
                                        onChange={(e) => handleProjectChange(index, 'project_description', e.target.value)}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Status</Translate>
                                    </label>
                                    <select
                                        value={project.project_status}
                                        onChange={(e) => handleProjectChange(index, 'project_status', e.target.value)}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    >
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleAddProject}
                        className="flex items-center text-sm text-teal-600 hover:text-teal-700"
                        type="button"
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        <Translate>Add Project</Translate>
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {formData.orgProjects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-medium text-gray-900">
                                    {project.project_name}
                                </h4>
                                <span className={getStatusBadgeClasses(project.project_status)}>
                                    {project.project_status.charAt(0).toUpperCase() + project.project_status.slice(1)}
                                </span>
                            </div>
                            <p className="text-gray-600 whitespace-pre-line">
                                {project.project_description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </EditSection>
    );
};

export default EditProjects;