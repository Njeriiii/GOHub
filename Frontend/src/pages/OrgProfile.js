import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import Header from '../components/Header';
import OrgProjects from './OrgProjects';
import Sidebar from '../components/Sidebar';

export default function OrgProfile() {
    // State variable to hold fetched data
    const [onboardingFormData, setOnboardingFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiClient = useApi();
    
    // Access and utilise admin details
    const location = useLocation(); 

    // Get the adminDetails or org object from location.state
    const adminDetails = location.state?.adminDetails || location.state?.org;

    useEffect(() => {
        if (!adminDetails) {
        console.error('Neither adminDetails nor org found in location.state');
        return;
        }

        apiClient.get(`/profile/org/${adminDetails.email}`)
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
    }, [apiClient, adminDetails]);

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
        </div>
        );
    }

    // If no data is available, display a message
    if (!onboardingFormData) {
        return <div className="text-center text-2xl text-gray-700 mt-10">No data available</div>;
    }

    // If data is available, display the org profile
    return (
        <div className="bg-gray-100 min-h-screen">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
            <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg shadow-xl overflow-hidden">
            <div className="p-8 sm:p-12 flex justify-between items-center">
                <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{onboardingFormData.orgProfile.org_name}</h1>
                <p className="text-xl text-white max-w-2xl mb-8">{onboardingFormData.orgProfile.org_overview}</p>
                <div className="flex space-x-4">
                    <a href="#" className="bg-orange-400 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-orange-500 transition duration-300">Join Us</a>
                    <a href="#" className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-teal-500 transition duration-300">Learn More</a>
                </div>
                </div>
                <div className="hidden sm:block">
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                    <span className="text-teal-500 text-xs text-center">
                    {onboardingFormData.orgProfile.org_name} Logo
                    </span>
                </div>
                </div>
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