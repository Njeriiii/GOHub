import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';

// Component to handle user login
export default function LoginPage() {

    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const apiClient = useApi();
    const { login, getUserId } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            if (response.ok) {

                // Store the token in localStorage
                localStorage.setItem('token', response.body.access_token);
                        
                // Redirect based on userType
                const nextPage = '/volunteer-form';
                navigate(nextPage);
            }
        } catch (error) {
            console.error('Error during login:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Log in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
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
                            Log in
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <a
                        href="/signup"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white-600 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Don't have an account? Sign up Here!
                    </a>
                </div>
            </div>
        </div>
    );
}