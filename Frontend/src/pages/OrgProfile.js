import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';
import Header from '../components/Header';
import OrgProjects from './OrgProjects';
import Sidebar from '../components/Sidebar';
import { Translate, DynamicTranslate } from '../contexts/TranslationProvider';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// This component displays the profile of an organization
// It includes the organization's name, overview, and projects
export default function OrgProfile() {
    const [onboardingFormData, setOnboardingFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiClient = useApi();
    const location = useLocation(); 
    const [userId, setUserId] = useState(null);
    const [adminId, setAdminId] = useState(null);

    useEffect(() => {
        if (location.state && location.state.org && location.state.org.user_id) {
            setUserId(location.state.org.user_id);
        }
    }, [location]);

    useEffect(() => {

        apiClient.get(`/profile/load_org?user_id=${userId}`)
        .then((response) => {
            if (response.ok) {
            setOnboardingFormData(response.body);
            setLoading(false);
            setAdminId(response.body.orgProfile.user_id);
            } else {
            console.error("Error fetching data: ", response.body);
            }
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
    }, [apiClient, userId]);

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
        );
    }

    if (!onboardingFormData) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center text-2xl text-gray-600 bg-white p-8 rounded-xl ">
            <Translate>No results found</Translate>
            </div>
        </div>
        );
    }

    return (
        <div className="bg-teal-50 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-xl overflow-hidden">
                    <div className="relative">
                {/* Cover Image Section */}
                <div className="relative h-72">
                    <div className="absolute inset-0">
                        {onboardingFormData.orgProfile.org_cover_photo_filename ? (
                            <img 
                                src={onboardingFormData.orgProfile.org_cover_photo_filename}
                                alt="Organization Cover" 
                                className="w-full h-full object-cover opacity-60"
                                onError={(e) => (e.target.style.display = 'none')}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-teal-500 to-teal-600" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Organization Info Overlay */}
                <div className="relative px-8 pb-8">
                    {/* Logo */}
                    <div className="absolute -mt-16 flex items-end">
                    <div className="bg-white rounded-xl p-2 shadow-lg">
                        <div className="w-28 h-28 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                        {onboardingFormData.orgProfile.org_logo_filename ? (
                            <img 
                            src={onboardingFormData.orgProfile.org_logo_filename}
                            alt="Organization Logo" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                                <span class="text-teal-600 text-xl font-bold">
                                                    ${onboardingFormData.orgProfile.org_name.charAt(0)}
                                                </span>
                                            `;
                            }}
                            />
                        ) : (
                            <span className="text-teal-600 text-xl font-bold">
                            {onboardingFormData.orgProfile.org_name.charAt(0)}
                            </span>
                        )}
                        </div>
                    </div>
                    </div>

                    {/* Organization Content */}
                    <div className="pt-20">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="max-w-3xl">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {onboardingFormData.orgProfile.org_name}
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            <DynamicTranslate>
                            {onboardingFormData.orgProfile.org_overview}
                            </DynamicTranslate>
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Admin Edit Button */}
            <div className="flex justify-end">
                <AdminEditButton orgData={onboardingFormData} adminId={adminId} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6">
                    <OrgProjects onboardingFormData={onboardingFormData} />
                </div>
                </div>
                <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6">
                    <Sidebar onboardingFormData={onboardingFormData} />
                </div>
                </div>
            </div>
            </div>
        </main>
        </div>
    );
}

function AdminEditButton({ orgData, adminId}) {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) return null;
    if (!user.is_admin) return null;

    const handleEditClick = () => {
        navigate('/edit_profile', { state: { orgData } });
    };

    if (adminId !== user.id) return null;

    return (
        <button
            onClick={handleEditClick}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200"
        >
            <PencilIcon className="h-4 w-4" />
            <Translate>Edit Profile</Translate>
        </button>
    );
}