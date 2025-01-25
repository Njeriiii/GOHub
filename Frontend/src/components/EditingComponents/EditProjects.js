import React, { useState } from 'react';
import { Translate } from '../../contexts/TranslationProvider';
import EditSection from './EditSection';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useApi } from '../../contexts/ApiProvider';

/**
 * EditProjects component for managing organization's projects
 * @param {Object} props
 * @param {Object} props.formData - Original form data
 * @param {Object} props.localData - Current local state
 * @param {Function} props.setLocalData - Function to update local state
 * @param {boolean} props.isEditing - Whether the section is in edit mode
 * @param {Function} props.onEdit - Callback when editing begins
 * @param {Function} props.onSaveComplete - Callback when save is complete
 * @param {Function} props.onCancel - Callback when editing is cancelled
 */
const EditProjects = ({
    formData,
    localData,
    setLocalData,
    isEditing,
    onEdit,
    onSaveComplete,
    onCancel,
}) => {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const apiClient = useApi();

    /**
     * Validates a single project's data
     * @param {Object} project - Project to validate
     * @returns {string|null} - Error message if invalid, null if valid
     */
    const validateProject = (project) => {
        if (!project.project_name?.trim()) {
            return 'Project name is required';
        }
        if (!project.project_description?.trim()) {
            return 'Project description is required';
        }
        if (!['ongoing', 'completed'].includes(project.project_status)) {
            return 'Invalid project status';
        }
        return null;
    };

    /**
     * Validates all projects before saving
     * @param {Array} projects - Array of projects to validate
     * @returns {boolean} - Whether all projects are valid
     */
    const validateAllProjects = (projects) => {
        for (let i = 0; i < projects.length; i++) {
            const error = validateProject(projects[i]);
            if (error) {
                setError(`Project ${i + 1}: ${error}`);
                return false;
            }
        }
        return true;
    };

    // Handle save operation
    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);

            const projects = localData.orgProjects;

            // Validate all projects
            if (!validateAllProjects(projects)) {
                return;
            }

            // Prepare projects data
            const projectsToSave = projects.map(project => ({
                ...project,
                org_id: formData.orgProfile.id,
                user_id: formData.orgProfile.user_id
            }));

            console.log('Saving projects:', projectsToSave);

            // Make API call to save projects
            const response = await apiClient.post('/profile/edit_projects', projectsToSave);

            if (!response.ok) {
                throw new Error('Failed to save changes');
            }

            // Update local state
            setLocalData({
                ...localData,
                orgProjects: projectsToSave
            });

            onSaveComplete();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

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
        // Clear error when user makes changes
        setError(null);
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
        <div className="space-y-4">
            <EditSection
                title="Projects"
                isEditing={isEditing}
                onEdit={onEdit}
                onSave={handleSave}
                onCancel={() => {
                    setError(null);
                    setLocalData({
                        ...localData,
                        orgProjects: [...formData.orgProjects]
                    });
                    onCancel();
                }}
            >
                {isEditing ? (
                    <div className="space-y-6">
                        {localData.orgProjects.map((project, index) => (
                            <div 
                                key={project.id || index} 
                                className="border border-gray-200 rounded-lg p-4 transition-colors hover:border-gray-300"
                            >
                                <div className="flex justify-between mb-4">
                                    <h4 className="text-lg font-medium text-gray-900">
                                        <Translate>Project {index + 1}</Translate>
                                    </h4>
                                    <button
                                        onClick={() => handleRemoveProject(index)}
                                        className="text-red-600 hover:text-red-700 transition-colors"
                                        type="button"
                                        aria-label="Remove project"
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
                                            maxLength={100}
                                            required
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
                                            maxLength={1000}
                                            required
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
                                            required
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
                            className="flex items-center text-sm text-teal-600 hover:text-teal-700 transition-colors"
                            type="button"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            <Translate>Add Project</Translate>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {localData.orgProjects.length === 0 ? (
                            <p className="text-gray-500 italic">
                                <Translate>No projects added yet</Translate>
                            </p>
                        ) : (
                            localData.orgProjects.map((project) => (
                                <div 
                                    key={project.id} 
                                    className="border border-gray-200 rounded-lg p-4 transition-colors hover:border-gray-300"
                                >
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
                            ))
                        )}
                    </div>
                )}
            </EditSection>
        </div>
    );
};

export default EditProjects;