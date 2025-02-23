// SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// This component represents the signup page.
// It allows users to sign up for an account using their email or Google account.
export default function SignupPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        // Implement your email signup logic here
        // After successful signup, navigate to user type selection
        navigate('/select-user-type', { 
            state: { email, password, firstName, lastName } 
            });
        };

    // This has not been implemented yet
    const handleGoogleSignup = () => {
        // Redirect to your backend's Google authentication route
        window.location.href = '/auth/login/google';
    };

return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="max-w-md w-full space-y-8">
        <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for an account
            </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleEmailSignup}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
            <div>
                <label htmlFor="first-name" className="sr-only">
                First Name
                </label>
                <input
                id="first-name"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="last-name" className="sr-only">
                Last Name
                </label>
                <input
                id="last-name"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email-address" className="sr-only">
                Email address
                </label>
                <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">
                Password
                </label>
                <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            </div>

            <div>
            <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                Sign up
            </button>
            </div>
        </form>
        <div>
            <button
            onClick={handleGoogleSignup}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
            Sign up with Google
            </button>
        </div>

        <div className="text-center">
            <a
                href="/login"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                Already have an account? Login!
            </a>
        </div>
        </div>
    </div>
    );
}    