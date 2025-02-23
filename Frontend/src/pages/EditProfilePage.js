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
    <div className="min-h-screen bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Organization Info Card */}
            <div className="bg-white p-6 rounded-sm mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {formData.orgProfile.org_name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
            <div className="bg-white rounded-sm mb-6">
                <nav className="flex space-x-4 p-2" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center py-3 px-4 rounded-lg font-medium text-sm transition-colors duration-200
                                ${activeTab === tab.id
                                    ? 'bg-teal-50 text-teal-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <tab.icon className="h-5 w-5 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="">
                {activeTab === 'basic' && (
                    <EditBasicInfo
                        formData={formData}
                        localData={localData}
                        setLocalData={setLocalData}
                        onEdit={() => handleEdit('basic')}
                        onSave={() => handleSave('basic')}
                        onCancel={() => handleCancel('basic')}
                    />
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
        </div>

            {/* Return to Profile Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleReturnToProfile}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                >
                    <span className="mr-2">Return to Profile</span>
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    </div>
);
}