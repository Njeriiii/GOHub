import React, { useEffect, useRef, useState } from 'react';
import { Translate } from '../../contexts/TranslationProvider';
import EditSection from './EditSection';
import MissionStatement from '../OnboardingFormComponents/MissionStatement';
import ContactInfo from '../OnboardingFormComponents/ContactInfo';
import OrgAddress from '../OnboardingFormComponents/OrgAddress';
import SocialMediaLinks from '../OnboardingFormComponents/SocialMediaLinks';
import { useApi } from '../../contexts/ApiProvider';
import { MapPin } from 'lucide-react';


/**
 * EditBasicInfo component for managing organization's basic information
 * @param {Object} props
 * @param {Object} props.formData - Original form data
 * @param {Object} props.localData - Current local state of the form
 * @param {Function} props.setLocalData - Function to update local state
 * @param {Function} props.onEdit - Callback when editing begins
 * @param {Function} props.onSaveComplete - Callback when save is complete
 * @param {Function} props.onCancel - Callback when editing is cancelled
 */
const EditBasicInfo = ({
    formData,
    localData,
    setLocalData,
    onEdit,
    onSaveComplete,
    onCancel,
}) => {

    // API client
    const apiClient = useApi();

    // Refs for child components
    const overviewTextAreaRef = useRef(null);
    const contactInfoRef = useRef(null);
    const addressRef = useRef(null);
    const socialMediaRef = useRef(null);

    // State management
    const [editingSections, setEditingSections] = useState({
        mission: false,
        overview: false,
        contact: false,
        address: false,
        social: false
    });
    const [savingSection, setSavingSection] = useState(null);
    const [error, setError] = useState(null);

    // Textarea height adjustment
    useEffect(() => {
        const adjustTextAreaHeight = () => {
            const textArea = overviewTextAreaRef.current;
            if (textArea) {
                textArea.style.height = 'auto';
                textArea.style.height = `${textArea.scrollHeight}px`;
            }
        };

        adjustTextAreaHeight();
        window.addEventListener('resize', adjustTextAreaHeight);
        return () => window.removeEventListener('resize', adjustTextAreaHeight);
    }, [localData.orgProfile.org_overview]);

    // Section management handlers
    const handleSectionEdit = (section) => {
        setEditingSections(prev => ({ ...prev, [section]: true }));
        setError(null);
        onEdit();
    };

    const handleSectionSave = async (section) => {
        try {
            setSavingSection(section);
            setError(null);

            // Collect and validate data based on section
            let sectionData = {};
            
            switch(section) {
                case 'contact':
                    if (!contactInfoRef.current) return;
                    const contactData = contactInfoRef.current.getData();
                    if (!contactData) throw new Error('Invalid contact data');
                    sectionData = {
                        org_email: contactData.email,
                        org_phone: contactData.phone
                    };
                    break;

                case 'address':
                    if (!addressRef.current) return;
                    const addressData = addressRef.current.getData();
                    console.log('addressData', addressData);
                    if (!addressData) throw new Error('Invalid address data');
                    sectionData = {
                        org_district_town: addressData.districtTown,
                        org_county: addressData.county,
                        org_po_box: addressData.poBox,
                        org_physical_description: addressData.physicalDescription,
                        org_google_maps_link: addressData.googleMapsLink
                    };
                    break;

                case 'social':
                    if (!socialMediaRef.current) return;
                    const socialData = socialMediaRef.current.getData();
                    if (!socialData) throw new Error('Invalid social media data');
                    sectionData = {
                        org_website: socialData.website,
                        org_facebook: socialData.facebook,
                        org_x: socialData.x,
                        org_instagram: socialData.instagram,
                        org_linkedin: socialData.linkedin,
                        org_youtube: socialData.youtube
                    };
                    break;

                case 'mission':
                case 'overview':
                    // These sections' data is already in localData
                    sectionData = {};
                    break;

                default:
                    throw new Error('Unknown section');
            }

            // Update local data with section changes
            const updatedProfile = {
                ...localData.orgProfile,
                ...sectionData
            };
            console.log('updatedProfile', updatedProfile);

            // Make API call to save the section
            const response = await apiClient.post('/profile/edit_basic_info', updatedProfile);

            console.log('response', response);

            if (!response.ok) {
                throw new Error('Failed to save changes');
            }

            // Update local state and notify parent
            setLocalData({
                ...localData,
                orgProfile: updatedProfile
            });

            console.log('localData', localData);

            setEditingSections(prev => ({ ...prev, [section]: false }));
            onSaveComplete();

        } catch (err) {
            setError(err.message);
        } finally {
            setSavingSection(null);
        }
    };

    const handleSectionCancel = (section) => {
        setEditingSections(prev => ({ ...prev, [section]: false }));
        setError(null);
        onCancel();
    };

    const handleOverviewChange = (e) => {
        const value = e.target.value;
        if (value.length <= 200) {
            setLocalData({
                ...localData,
                orgProfile: {
                    ...localData.orgProfile,
                    org_overview: value
                }
            });
        }
    };

    console.log('localData.orgProfile', localData.orgProfile);

    return (
        <div className="space-y-6">
            {/* Mission Section */}
            <div>
                <EditSection
                title="Mission"
                isEditing={editingSections.mission}
                onEdit={() => handleSectionEdit('mission')}
                onSave={() => handleSectionSave('mission')}
                onCancel={() => handleSectionCancel('mission')}
                isSaving={savingSection === 'mission'}
            >
                {editingSections.mission ? (
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
                            <p className="mt-1 text-gray-600">{localData.orgProfile.org_mission_statement}</p>
                        </div>
                    </div>
                )}
                </EditSection>
            </div>

            {/* Overview Section */}
            <div>
                <EditSection
                title="Organization Overview"
                isEditing={editingSections.overview}
                onEdit={() => handleSectionEdit('overview')}
                onSave={() => handleSectionSave('overview')}
                onCancel={() => handleSectionCancel('overview')}
                isSaving={savingSection === 'overview'}
            >
                {editingSections.overview ? (
                    <div className="p-6 relative">
                        <textarea
                            ref={overviewTextAreaRef}
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
                        <p className="text-gray-600">{localData.orgProfile.org_overview}</p>
                    </div>
                )}
                </EditSection>
            </div>
            
            <div>
            {/* Contact Info Section */}
            <EditSection
                title="Contact Information"
                isEditing={editingSections.contact}
                onEdit={() => handleSectionEdit('contact')}
                onSave={() => handleSectionSave('contact')}
                onCancel={() => handleSectionCancel('contact')}
                isSaving={savingSection === 'contact'}
            >
                {editingSections.contact ? (
                    <ContactInfo
                        ref={contactInfoRef}
                        initialValues={{
                            email: localData.orgProfile.org_email || '',
                            phone: localData.orgProfile.org_phone || ''
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700">Email</h4>
                            <p className="mt-1 text-gray-600">{localData.orgProfile.org_email}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700">Phone</h4>
                            <p className="mt-1 text-gray-600">{localData.orgProfile.org_phone}</p>
                        </div>
                    </div>
                )}
                </EditSection>
            </div>

            {/* Address Section */}
            <div>
                <EditSection
                    title="Location"
                    isEditing={editingSections.address}
                    onEdit={() => handleSectionEdit('address')}
                    onSave={() => handleSectionSave('address')}
                    onCancel={() => handleSectionCancel('address')}
                    isSaving={savingSection === 'address'}
                >
                    {editingSections.address ? (
                        <OrgAddress
                            ref={addressRef}
                            initialValues={{
                                districtTown: localData.orgProfile.org_district_town,
                                org_county: localData.orgProfile.org_county,
                                poBox: localData.orgProfile.org_po_box,
                                physicalDescription: localData.orgProfile.org_physical_description,
                                googleMapsLink: localData.orgProfile.org_google_maps_link
                            }}
                        />
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">District/Town</h4>
                                    <p className="mt-1 text-gray-600">{localData.orgProfile.org_district_town}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">org_county</h4>
                                    <p className="mt-1 text-gray-600">{localData.orgProfile.org_county}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">P.O. Box</h4>
                                    <p className="mt-1 text-gray-600">{localData.orgProfile.org_po_box}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700">Physical Description</h4>
                                <p className="mt-1 text-gray-600">{localData.orgProfile.org_physical_description}</p>
                            </div>
                            {localData.orgProfile.org_google_maps_link && (
                                <div>
                                    <a 
                                        href={localData.orgProfile.org_google_maps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        View on Google Maps
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </EditSection>
            </div>

            <div>
                {/* Social Media Section */}
                <EditSection
                    title="Social Media"
                    isEditing={editingSections.social}
                    onEdit={() => handleSectionEdit('social')}
                    onSave={() => handleSectionSave('social')}
                    onCancel={() => handleSectionCancel('social')}
                    isSaving={savingSection === 'social'}
                >
                    {editingSections.social ? (
                        <SocialMediaLinks
                            ref={socialMediaRef}
                            initialValues={{
                                website: localData.orgProfile.org_website || '',
                                facebook: localData.orgProfile.org_facebook || '',
                                x: localData.orgProfile.org_x || '',
                                instagram: localData.orgProfile.org_instagram || '',
                                linkedin: localData.orgProfile.org_linkedin || '',
                                youtube: localData.orgProfile.org_youtube || ''
                            }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { key: 'website', label: 'Website', value: localData.orgProfile.org_website },
                                { key: 'facebook', label: 'Facebook', value: localData.orgProfile.org_facebook },
                                { key: 'x', label: 'X (Twitter)', value: localData.orgProfile.org_x },
                                { key: 'instagram', label: 'Instagram', value: localData.orgProfile.org_instagram },
                                { key: 'linkedin', label: 'LinkedIn', value: localData.orgProfile.org_linkedin },
                                { key: 'youtube', label: 'YouTube', value: localData.orgProfile.org_youtube }
                            ].map(platform => platform.value && (
                                <div key={platform.key}>
                                    <h4 className="text-sm font-medium text-gray-700">{platform.label}</h4>
                                    <a 
                                        href={platform.value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 text-teal-600 hover:text-teal-700 text-sm block truncate"
                                    >
                                        {new URL(platform.value).hostname}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </EditSection>
            </div>
        </div>
    );
};

export default EditBasicInfo;