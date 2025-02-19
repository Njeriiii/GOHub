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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
        </div>
        );
    }

    // If no data is available, display a message
    if (!onboardingFormData) {
        return <div className="text-center text-2xl text-gray-700 mt-10"><Translate>No results found</Translate></div>;
    }

    // If data is available, display the org profile
    return (
        <div className="bg-gray-100 min-h-screen">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-10">
                <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 rounded-lg shadow-xl overflow-hidden">
                    <div className="relative">
                        {onboardingFormData.orgProfile.org_cover_photo_filename && (
                            <img 
                                src={onboardingFormData.orgProfile.org_cover_photo_filename} 
                                alt="Organization Cover" 
                                className="w-full h-64 object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                    <div className="p-8 sm:p-12 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{onboardingFormData.orgProfile.org_name}</h1>
                            <p className="text-xl text-white max-w-2xl mb-8"><DynamicTranslate>{onboardingFormData.orgProfile.org_overview}</DynamicTranslate></p>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-orange-400 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-orange-500 transition duration-300"><Translate>Join Us</Translate></a>
                                <a href="#" className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-teal-500 transition duration-300"><Translate>Learn More</Translate></a>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                                {onboardingFormData.orgProfile.org_logo_filename ? (
                                    <img 
                                        src={onboardingFormData.orgProfile.org_logo_filename} 
                                        alt="Organization Logo" 
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.closest('div').innerHTML = `
                                                <span className="text-teal-500 text-xs text-center">
                                                    ${onboardingFormData.orgProfile.name} Logo
                                                </span>
                                            `;
                                        }}
                                    />
                                ) : (
                                    <span className="text-teal-500 text-xs text-center">
                                        {onboardingFormData.orgProfile.name} Logo
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <AdminEditButton 
                        orgData={onboardingFormData} 
                    />
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <OrgProjects onboardingFormData={onboardingFormData} />
            </div>
            <div className="lg:col-span-1">
                <Sidebar onboardingFormData={onboardingFormData} />
            </div>
            </div>
        </main>
        </div>
    );
}

function AdminEditButton({ orgData}) {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) return null;
    if (!user.is_admin) return null;

    const handleEditClick = () => {
        navigate('/edit_profile', { state: { orgData } });
    };

    return (
        <button
            onClick={handleEditClick}
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 "
        >
            <PencilIcon className="h-4 w-4" />
            <Translate>Edit Profile</Translate>
        </button>
    );
}