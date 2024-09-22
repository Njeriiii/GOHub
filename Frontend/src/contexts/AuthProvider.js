import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ApiClient from '../ApiClient';
// This component provides authentication context to its children components.
// It includes functions for user login, logout, and fetching user data.
// It also manages the authentication token and user data in localStorage.


// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    // State to store the current user
    // Initialize from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // State to track if we're loading authentication data
    const [loading, setLoading] = useState(true);

    // Create an instance of the API client
    const [api] = useState(() => new ApiClient());

    // Function to set user data and persist it to localStorage
    const setUserAndPersist = useCallback((userData) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
    }, []);

    // Function to set the token in localStorage and update the API client
    const setToken = useCallback((token) => {
        localStorage.setItem('token', token);
        api.setToken(token);
    }, [api]);

    // Function to remove the token from localStorage and clear it from the API client
    const removeToken = useCallback(() => {
        localStorage.removeItem('token');
        api.setToken(null);
    }, [api]);

    // Function to refresh the authentication token
    const refreshToken = useCallback(async () => {
        try {
            const response = await api.post('/auth/refresh');
            if (response.ok) {
                setToken(response.body.access_token);
                return true;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
        return false;
    }, [api, setToken]);

    // Function to fetch the current user's data
    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get('/auth/user');
            if (response.ok) {
                setUserAndPersist(response.body);
            } else {
                setUserAndPersist(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUserAndPersist(null);
        } finally {
            setLoading(false);
        }
    }, [api, setUserAndPersist]);

    // Function to handle user login
    const login = useCallback(async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.ok) {
            setToken(response.body.access_token);
            await fetchUser();
        }
        return response;
    }, [api, fetchUser, setToken]);

    // Function to handle user logout
    const logout = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, user is already logged out');
                setUser(null);
                return;
            }
            const response = await api.post('/auth/logout');
            if (response.ok) {
                removeToken();
                setUserAndPersist(null);
                console.log('Logout successful');
            } else {
                console.error('Logout failed:', response.body);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }, [api, removeToken, setUserAndPersist]);

    // Function to get the current user's ID
    const getUserId = useCallback(() => {
        return user ? user.id : null;
    }, [user]);

    // Effect to initialize authentication state
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.setToken(token);
                // Try to refresh the token and fetch user data
                if (await refreshToken()) {
                    await fetchUser();
                } else {
                    // If refresh fails, remove the token
                    removeToken();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [api, refreshToken, fetchUser, removeToken]);

    // Effect to set up periodic token refresh
    useEffect(() => {
        // Refresh token every 14 minutes (assuming a 15-minute token lifespan)
        let refreshInterval = setInterval(refreshToken, 14 * 60 * 1000);
        // Clear the interval when the component unmounts
        return () => clearInterval(refreshInterval);
    }, [refreshToken]);

    // Create the value object for the context
    // This object contains all the authentication-related data and functions
    // that will be provided to the children components
    const value = useMemo(() => ({
        user,           // The current user object
        login,          // Function to log in
        logout,         // Function to log out
        fetchUser,      // Function to fetch user data
        getUserId,      // Function to get the current user's ID
        loading         // Boolean indicating if auth data is being loaded
    }), [user, login, logout, fetchUser, getUserId, loading]);

    // Provide the authentication context to children components
    // Only render children when not loading to prevent premature rendering
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;