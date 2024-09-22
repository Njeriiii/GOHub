// SelectUserTypePage.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';

// This component represents the user type selection page.
// It allows users to select their user type (admin or volunteer) during the signup process.
export default function SelectUserTypePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = location.state;
    const apiClient = new useApi();

    const handleSelection = async (userType) => {

        try {
            const response = await apiClient.post('/auth/signup', {
                ...userDetails,
                isAdmin: userType === 'admin'
            });
        
            if (response.ok) {

                const nextPage = '/login';  // Always redirect to login page
                navigate(nextPage, { state: { userId: response.body.user_id, userType: userType } });

            } else {
                // ApiClient already handles errors, so we can use the error message directly
                throw new Error(response.body.message || 'Signup failed');
            }
            } catch (error) {
            console.error('Error during signup:', error);
            // Handle error (e.g., show error message to user)
            }
        };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
            <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Select User Type
            </h2>
            </div>
            <div className="mt-8 space-y-6">
            <button
                onClick={() => handleSelection('admin')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                I'm an Admin
            </button>
            <button
                onClick={() => handleSelection('volunteer')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                I'm a Volunteer
            </button>
            </div>
        </div>
        </div>
    );
}