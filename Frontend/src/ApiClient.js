import axios from "axios";
// ApiClient is a class for making HTTP requests to a specified API.
// It uses Axios to send HTTP requests with various HTTP methods (GET, POST, PUT, DELETE)
// and provides consistent error handling and response structure.
// The base URL for API requests is obtained from environment variables.
// Source: React Mega Tutorial Chapter 6 by Miguel Grinberg

// Import the BASE_API_URL from environment variables in frontend/.env
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
//const BASE_API_URL = 'https://internlink.onrender.com';
    
// Create a class for the ApiClient
export default class ApiClient {
    constructor() {
        // Initialize the base URL for API requests using the provided BASE_API_URL
        // This includes the base URL obtained from the REACT_APP_BASE_API_URL environment variable, and the /api path prefix.
        // this.base_url = BASE_API_URL;
        this.base_url = BASE_API_URL;
    }

    // Method for making HTTP requests with options
    // This method takes all of its arguments from an options object.
    async request(options) {
        // Convert query parameters into a string and add a '?' if there are any -- to signify the beginning of query parameters
        let query = new URLSearchParams(options.query || {}).toString();
        let queryUrl = ""; // Define 'queryUrl' here with an empty string

        if (query !== "") {
            queryUrl = "?" + query;
        }

        const axiosWithCookies = axios.create({
            withCredentials: true,
        });

        // Prepare headers
        const headers = {
            ...options.headers
        };

        // Set Content-Type to application/json for non-FormData bodies
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            // Send the HTTP request using Axios
            // The method and url keys in this object are set by the get(), post(), put() and delete() helper methods, from its input arguments.
            const response = await axiosWithCookies({
                method: options.method,
                // build the URL by concatenating the base URL, endpoint, and query parameters (if any)
                url: `${this.base_url}${options.url}${queryUrl}`,
                headers: headers,
                data: options.body instanceof FormData ? options.body : JSON.stringify(options.body),
            });

            // Handle errors and return a consistent error structure
            return {
                ok: response.status >= 200 && response.status < 300,
                status: response.status,
                body: response.status !== 204 ? response.data : null,
            };
        } catch (error) {
            // Handle errors and return a consistent error structure
            console.error("Request failed:", error);
            return {
                ok: false,
                status: error.response.status || 500,
                body: {
                    code: error.response.status || 500,
                    message:
                        error.response.data.message ||
                        "The server is unresponsive",
                    description: error.toString(),
                },
            };
        }
    }

    // Method for making a GET request
    async get(url, query, options) {
        return this.request({ method: "GET", url, query, ...options });
    }

    // Method for making a POST request
    async post(url, body, options = {}) {
        // Check if the body is FormData and adjust headers
        if (body instanceof FormData) {
            return this.request({
                method: "POST",
                url,
                body,
                headers: {
                    ...options.headers, // Do not set 'Content-Type' for FormData
                },
            });
        } else {
            return this.request({
                method: "POST",
                url,
                body,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            });
        }
    }
    
    // Method for making a PUT request
    async put(url, body, options) {
        return this.request({ method: "PUT", url, body, ...options });
    }

    // Method for making a DELETE request
    async delete(url, options) {
        return this.request({ method: "DELETE", url, ...options });
    }
}