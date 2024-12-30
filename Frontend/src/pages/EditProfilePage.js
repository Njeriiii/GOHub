import React, { useState, useRef } from 'react';
import { Translate } from '../contexts/TranslationProvider';
import { useLocation } from 'react-router-dom';
import { 
    BuildingOfficeIcon, 
    DocumentIcon,
    TrashIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import EditSection from '../components/EditingComponents/EditSection.js';
import EditSupportNeeds from '../components/EditingComponents/EditSupportNeeds.js';
import EditOrgDetails from '../components/EditingComponents/EditOrgDetails.js';
import EditMission from '../components/EditingComponents/EditMission.js';

export default function EditProfile({  }) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('basic');
    const [editingSections, setEditingSections] = useState({});
    const [localData, setLocalData] = useState(location.state.orgData);
    const [formData, setFormData] = useState(location.state.orgData);

    // Function to handle completion of save operations
    const handleSaveComplete = (section) => {
        setEditingSections(prev => ({ ...prev, [section]: false }));
    };

    const tabs = [
        { id: 'basic', label: 'Basic Information', icon: BuildingOfficeIcon },
        { id: 'initiatives', label: 'Initiatives', icon: DocumentIcon },
        { id: 'projects', label: 'Projects', icon: DocumentIcon },
        { id: 'skills', label: 'Skills Needed', icon: DocumentIcon }
    ];

    const handleEdit = (section) => {
        setEditingSections(prev => ({ ...prev, [section]: true }));
    };

    const handleSave = async (section) => {
        try {
            // API call would go here to save the specific section
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
                    <EditMission
                        formData={formData}
                        localData={localData}
                        setLocalData={setLocalData}
                        isEditing={editingSections.mission}
                        onEdit={() => handleEdit('mission')}
                        onSave={() => handleSave('mission')}
                        onCancel={() => handleCancel('mission')}
                    />
                    
                    <EditOrgDetails
                        formData={formData}
                        localData={localData}
                        setLocalData={setLocalData}
                        isEditing={editingSections.details}
                        onEdit={() => handleEdit('details')}
                        onSave={() => handleSave('details')}
                        onCancel={() => handleCancel('details')}
                    />
                </div>
            )}
            {activeTab === 'basic' && (
                <div>
                    {/* <EditSection
                        title="Mission & Overview"
                        isEditing={editingSections.mission}
                        onEdit={() => handleEdit('mission')}
                        onSave={() => handleSave('mission')}
                        onCancel={() => handleCancel('mission')}
                    >
                        {editingSections.mission ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Mission Statement</Translate>
                                    </label>
                                    <textarea
                                        value={localData.orgProfile.org_mission_statement}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_mission_statement: e.target.value
                                            }
                                        })}
                                        rows={3}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Overview</Translate>
                                    </label>
                                    <textarea
                                        value={localData.orgProfile.org_overview}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_overview: e.target.value
                                            }
                                        })}
                                        rows={2}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Mission Statement</h4>
                                    <p className="mt-1 text-gray-600">{formData.orgProfile.org_mission_statement}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Overview</h4>
                                    <p className="mt-1 text-gray-600">{formData.orgProfile.org_overview}</p>
                                </div>
                            </div>
                        )}
                    </EditSection> */}

                    {/* Add more sections here for contact info, location, social media */}
                    <EditSection
                        title="Contact Information"
                        isEditing={editingSections.contact}
                        onEdit={() => handleEdit('contact')}
                        onSave={() => handleSave('contact')}
                        onCancel={() => handleCancel('contact')}
                    >
                        {editingSections.contact ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Email</Translate>
                                    </label>
                                    <input
                                        type="email"
                                        value={localData.orgProfile.org_email}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_email: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Phone</Translate>
                                    </label>
                                    <input
                                        type="tel"
                                        value={localData.orgProfile.org_phone}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_phone: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Website</Translate>
                                    </label>
                                    <input
                                        type="url"
                                        value={localData.orgProfile.org_website}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_website: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Email</h4>
                                    <p className="mt-1 text-gray-600">{formData.orgProfile.org_email}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Phone</h4>
                                    <p className="mt-1 text-gray-600">{formData.orgProfile.org_phone}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Website</h4>
                                    <p className="mt-1 text-gray-600">{formData.orgProfile.org_website || '—'}</p>
                                </div>
                            </div>
                        )}
                    </EditSection>

                    <EditSection
                        title="Location"
                        isEditing={editingSections.location}
                        onEdit={() => handleEdit('location')}
                        onSave={() => handleSave('location')}
                        onCancel={() => handleCancel('location')}
                    >
                        {editingSections.location ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Physical Description</Translate>
                                    </label>
                                    <input
                                        type="text"
                                        value={localData.orgProfile.org_physical_description}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_physical_description: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>District/Town</Translate>
                                    </label>
                                    <input
                                        type="text"
                                        value={localData.orgProfile.org_district_town}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_district_town: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>County</Translate>
                                    </label>
                                    <input
                                        type="text"
                                        value={localData.orgProfile.org_county}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_county: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Country</Translate>
                                    </label>
                                    <input
                                        type="text"
                                        value={localData.orgProfile.org_country}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_country: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>P.O. Box</Translate>
                                    </label>
                                    <input
                                        type="text"
                                        value={localData.orgProfile.org_po_box}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_po_box: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Google Maps Link</Translate>
                                    </label>
                                    <input
                                        type="url"
                                        value={localData.orgProfile.org_google_maps_link}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_google_maps_link: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Physical Address</h4>
                                    <p className="mt-1 text-gray-600">
                                        {formData.orgProfile.org_physical_description}
                                        <br />
                                        {formData.orgProfile.org_district_town}, {formData.orgProfile.org_county}
                                        <br />
                                        {formData.orgProfile.org_country}
                                        <br />
                                        {formData.orgProfile.org_po_box}
                                    </p>
                                </div>
                                {formData.orgProfile.org_google_maps_link && (
                                    <div>
                                        <a 
                                            href={formData.orgProfile.org_google_maps_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-teal-600 hover:text-teal-700 text-sm"
                                        >
                                            View on Google Maps
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </EditSection>

                    <EditSection
                        title="Social Media"
                        isEditing={editingSections.social}
                        onEdit={() => handleEdit('social')}
                        onSave={() => handleSave('social')}
                        onCancel={() => handleCancel('social')}
                    >
                        {editingSections.social ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Facebook</Translate>
                                    </label>
                                    <input
                                        type="url"
                                        value={localData.orgProfile.org_facebook}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_facebook: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>Instagram</Translate>
                                    </label>
                                    <input
                                        type="url"
                                        value={localData.orgProfile.org_instagram}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_instagram: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>X (Twitter)</Translate>
                                    </label>
                                    <input
                                        type="url"
                                        value={localData.orgProfile.org_x}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_x: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>LinkedIn</Translate>
                                    </label>
                                    <input
                                        type="url"
                                        value={localData.orgProfile.org_linkedin}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_linkedin: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Translate>YouTube</Translate>
                                    </label>
                                    <input
                                        type="url"
                                        value={localData.orgProfile.org_youtube}
                                        onChange={(e) => setLocalData({
                                            ...localData,
                                            orgProfile: {
                                                ...localData.orgProfile,
                                                org_youtube: e.target.value
                                            }
                                        })}
                                        className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Facebook', value: formData.orgProfile.org_facebook },
                                    { label: 'Instagram', value: formData.orgProfile.org_instagram },
                                    { label: 'X (Twitter)', value: formData.orgProfile.org_x },
                                    { label: 'LinkedIn', value: formData.orgProfile.org_linkedin },
                                    { label: 'YouTube', value: formData.orgProfile.org_youtube }
                                ].map(social => social.value && (
                                    <div key={social.label}>
                                        <h4 className="text-sm font-medium text-gray-700">{social.label}</h4>
                                        <a 
                                            href={social.value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 text-teal-600 hover:text-teal-700 text-sm block truncate"
                                        >
                                            {new URL(social.value).pathname.slice(1)}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </EditSection>
                </div>
            )}

            {/* Initiative editing sections */}
            {activeTab === 'initiatives' && (
                <div>
                    <div className="space-y-6">
                        <EditSection
                            title="Initiatives"
                            isEditing={editingSections.initiatives}
                            onEdit={() => handleEdit('initiatives')}
                            onSave={() => handleSave('initiatives')}
                            onCancel={() => handleCancel('initiatives')}
                        >
                        {editingSections.initiatives ? (
                            <div className="space-y-6">
                                {localData.orgInitiatives.map((initiative, index) => (
                                    <div key={initiative.id || index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between mb-4">
                                            <h4 className="text-lg font-medium text-gray-900">
                                                <Translate>Initiative {index + 1}</Translate>
                                            </h4>
                                            <button
                                                onClick={() => {
                                                    const newInitiatives = localData.orgInitiatives.filter((_, i) => i !== index);
                                                    setLocalData({
                                                        ...localData,
                                                        orgInitiatives: newInitiatives
                                                    });
                                                }}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    <Translate>Initiative Name</Translate>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={initiative.initiative_name}
                                                    onChange={(e) => {
                                                        const updatedInitiatives = [...localData.orgInitiatives];
                                                        updatedInitiatives[index] = {
                                                            ...initiative,
                                                            initiative_name: e.target.value
                                                        };
                                                        setLocalData({
                                                            ...localData,
                                                            orgInitiatives: updatedInitiatives
                                                        });
                                                    }}
                                                    className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    <Translate>Description</Translate>
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={initiative.initiative_description}
                                                    onChange={(e) => {
                                                        const updatedInitiatives = [...localData.orgInitiatives];
                                                        updatedInitiatives[index] = {
                                                            ...initiative,
                                                            initiative_description: e.target.value
                                                        };
                                                        setLocalData({
                                                            ...localData,
                                                            orgInitiatives: updatedInitiatives
                                                        });
                                                    }}
                                                    className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        setLocalData({
                                            ...localData,
                                            orgInitiatives: [
                                                ...localData.orgInitiatives,
                                                {
                                                    initiative_name: '',
                                                    initiative_description: '',
                                                    org_id: formData.orgProfile.id
                                                }
                                            ]
                                        });
                                    }}
                                    className="flex items-center text-sm text-teal-600 hover:text-teal-700"
                                >
                                    <PlusIcon className="h-5 w-5 mr-1" />
                                    <Translate>Add Initiative</Translate>
                                </button>
                            </div>
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
                    </div>
                </div>
            )}

            {/* Project editing sections */}
            {activeTab === 'projects' && (
            <div className="space-y-6">
                <EditSection
                    title="Projects"
                    isEditing={editingSections.projects}
                    onEdit={() => handleEdit('projects')}
                    onSave={() => handleSave('projects')}
                    onCancel={() => handleCancel('projects')}
                >
                    {editingSections.projects ? (
                        <div className="space-y-6">
                            {localData.orgProjects.map((project, index) => (
                                <div key={project.id || index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between mb-4">
                                        <h4 className="text-lg font-medium text-gray-900">
                                            <Translate>Project {index + 1}</Translate>
                                        </h4>
                                        <button
                                            onClick={() => {
                                                const newProjects = localData.orgProjects.filter((_, i) => i !== index);
                                                setLocalData({
                                                    ...localData,
                                                    orgProjects: newProjects
                                                });
                                            }}
                                            className="text-red-600 hover:text-red-700"
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
                                                onChange={(e) => {
                                                    const updatedProjects = [...localData.orgProjects];
                                                    updatedProjects[index] = {
                                                        ...project,
                                                        project_name: e.target.value
                                                    };
                                                    setLocalData({
                                                        ...localData,
                                                        orgProjects: updatedProjects
                                                    });
                                                }}
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
                                                onChange={(e) => {
                                                    const updatedProjects = [...localData.orgProjects];
                                                    updatedProjects[index] = {
                                                        ...project,
                                                        project_description: e.target.value
                                                    };
                                                    setLocalData({
                                                        ...localData,
                                                        orgProjects: updatedProjects
                                                    });
                                                }}
                                                className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Translate>Status</Translate>
                                            </label>
                                            <select
                                                value={project.project_status}
                                                onChange={(e) => {
                                                    const updatedProjects = [...localData.orgProjects];
                                                    updatedProjects[index] = {
                                                        ...project,
                                                        project_status: e.target.value
                                                    };
                                                    setLocalData({
                                                        ...localData,
                                                        orgProjects: updatedProjects
                                                    });
                                                }}
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
                                onClick={() => {
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
                                }}
                                className="flex items-center text-sm text-teal-600 hover:text-teal-700"
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
                                        <span className={`
                                            px-2 py-1 text-xs font-medium rounded-full
                                            ${project.project_status === 'completed' ? 'bg-green-100 text-green-800' : 
                                            project.project_status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-yellow-100 text-yellow-800'}
                                        `}>
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
            </div>
        )}

            {/* Skills editing sections */}
            {activeTab === 'skills' && (
            <EditSupportNeeds
                formData={formData}
                isEditing={editingSections.skills}
                onEdit={() => handleEdit('skills')}
                onSaveComplete={handleSaveComplete}
                onCancel={() => handleCancel('skills')}
                setLocalData={setLocalData}
            />
)}
        </div>
)};