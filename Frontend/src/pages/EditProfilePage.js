import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    BuildingOfficeIcon, 
    DocumentIcon,
    ArrowRightIcon,
    CameraIcon
} from '@heroicons/react/24/outline';
import EditSupportNeeds from '../components/EditingComponents/EditSupportNeeds.js';
import EditBasicInfo from '../components/EditingComponents/EditBasicInfo.js';
import EditInitiatives from '../components/EditingComponents/EditInitiatives.js';
import EditProjects from '../components/EditingComponents/EditProjects.js';
import ProfileImages from '../components/OrgProfileFormComponents/ProfileImages.js';

export default function EditProfile({  }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basic');
    const [editingSections, setEditingSections] = useState({});
    const [localData, setLocalData] = useState(location.state.orgData);
    const [formData, setFormData] = useState(location.state.orgData);

    const tabs = [
        { id: 'basic', label: 'Basic Information', icon: BuildingOfficeIcon },
        { id: 'initiatives', label: 'Initiatives', icon: DocumentIcon },
        { id: 'projects', label: 'Projects', icon: DocumentIcon },
        { id: 'skills', label: 'Skills Needed', icon: DocumentIcon },
        { id: 'images', label: 'Images', icon: CameraIcon}
    ];

    const handleEdit = (section) => {
        setEditingSections(prev => ({ ...prev, [section]: true }));
    };

    const handleSave = async (section) => {
        try {
            console.log(`Saving section: ${section}`, localData);
            setEditingSections(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleCancel = (section) => {
        setLocalData(formData); // Reset to original data
        setEditingSections(prev => ({ ...prev, [section]: false }));
    };

    const handleReturnToProfile = () => {
        navigate('/org_profile', { 
            state: { 
                org: { user_id: formData.orgProfile.user_id }
            } 
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Read-only organization info */}
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {formData.orgProfile.org_name}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Registration Number:</span>
                        <span className="ml-2 font-medium">{formData.orgProfile.org_registration_number}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Year Established:</span>
                        <span className="ml-2 font-medium">{formData.orgProfile.org_year_established}</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-4" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === tab.id
                                    ? 'border-teal-500 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <tab.icon className="h-5 w-5 inline-block mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'basic' && (
                <div className="">
                    <EditBasicInfo
                        formData={formData}
                        localData={localData}
                        setLocalData={setLocalData}
                        onEdit={() => handleEdit('basic')}
                        onSave={() => handleSave('basic')}
                        onCancel={() => handleCancel('basic')}
                    />
                </div>
            )}

            {/* Inside your parent component */}
            {activeTab === 'initiatives' && (
                <EditInitiatives
                    formData={formData}
                    localData={localData}
                    setLocalData={setLocalData}
                    isEditing={editingSections.initiatives}
                    onEdit={() => handleEdit('initiatives')}
                    onSaveComplete={() => handleSave('initiatives')}
                    onCancel={() => handleCancel('initiatives')}
                />
            )}

            {/* Project editing sections */}
            {activeTab === 'projects' && (
                <EditProjects
                    formData={formData}
                    localData={localData}
                    setLocalData={setLocalData}
                    isEditing={editingSections.projects}
                    onEdit={() => handleEdit('projects')}
                    onSaveComplete={() => handleSave('projects')}
                    onCancel={() => handleCancel('projects')}
                />
            )}

            {/* Skills editing sections */}
            {activeTab === 'skills' && (
            <EditSupportNeeds
                formData={formData}
                isEditing={editingSections.skills}
                onEdit={() => handleEdit('skills')}
                onSaveComplete={() => handleSave('skills')}
                onCancel={() => handleCancel('skills')}
                localData={localData}
                setLocalData={setLocalData}
            />
            )}

            {/* Images editing sections */}
            {activeTab === 'images' && (
                <ProfileImages 
                    onEdit={true}
            />
            )}

            {/* Return to Profile Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleReturnToProfile}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                >
                    <span className="mr-2">Return to Profile</span>
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
)};