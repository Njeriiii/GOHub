// In ParentComponent.js
import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OrgProjects from './OrgProjects';

export default function OrgProfile() { // Changed to an export default 
    
    // State variable to hold fetched data
    const [onboardingFormData, setOnboardingFormData] = useState(null);

    // State variable to hold loading status
    const [loading, setLoading] = useState(true);

    const apiClient = useApi();

    // Define the adminDetails variable
    let adminDetails;

    // Access and utilise admin details
    const location = useLocation();

    if (location.state?.adminDetails) {
        adminDetails = location.state.adminDetails; 
    } else if (location.state?.org) { // Check if org exists
        adminDetails = location.state.org; 
    } else {
        // Handle the case where neither exists (error handling)
        console.error('Neither adminDetails nor org found in location.state');
    }

    // Load the organisation's data from the backend using the admin email
    useEffect(() => {

        if (!adminDetails) {
            return;
        }

        apiClient.get(`/profile/org/${adminDetails.email}`)
            .then((response) => {

                if (response.ok) {
                    setOnboardingFormData(response?.body);
                    setLoading(false);

                } else if (response.status === 401) {
                }
                else {
                    console.error("Error fetching data: ", response.body);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });

    }, [apiClient]);


    return (

    <div class="bg-gray-100 texture-subtle">

        <div>
            <Header />
        </div>

        {/* check if onboardingFormData is null */}
        {loading && <p>Loading...</p>}
        {!loading && onboardingFormData && (

        <div>
            <div>
                <div class="bg-gradient-to-r from-indigo-900 to-purple-800 p-8 md:p-12">
                    <div class="container mx-auto">
                        <div class="flex flex-col md:flex-row items-center justify-between">
                            <div class="mb-8 md:mb-0 text-center md:text-left">
                                <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">{onboardingFormData.orgProfile.org_name}</h1>
                                <p class="text-xl md:text-2xl text-indigo-200 max-w-3xl">{onboardingFormData.orgProfile.org_overview}</p>
                            </div>
                            <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                                <a href="#" class="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-200 transition duration-300">Join Us</a>
                                <a href="#" class="bg-transparent text-white border-2 border-red px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-900 transition duration-300">Learn More</a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-12 md:mt-24">
                        <div class="container mx-auto">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div class="bg-white rounded-lg shadow-lg p-8">
                                    <h3 class="text-2xl font-bold text-indigo-900 mb-4">Our Mission</h3>
                                    <p class="text-lg text-gray-700">{onboardingFormData.orgProfile.org_overview}</p>
                                </div>
                                <div class="bg-white rounded-lg shadow-lg p-8">
                                    <h3 class="text-2xl font-bold text-indigo-900 mb-4">Our Vision</h3>
                                    <p class="text-lg text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                                </div>
                                <div class="bg-white rounded-lg shadow-lg p-8">
                                    <h3 class="text-2xl font-bold text-indigo-900 mb-4">Our Values</h3>
                                    <p class="text-lg text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <OrgProjects onboardingFormData={onboardingFormData} /> 
                    < Sidebar onboardingFormData={onboardingFormData} />
                </div>
            </div>
        </div>
)}
    </div>
    );
}