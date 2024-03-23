// Search.js
import React, { useState } from 'react';

export default function KeyWordSearch({ orgData, onSearchResults }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Function to handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const performSearch = () => {

        // Check if the search term is empty and give an alert
        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }

        // Implementing basic search logic
        // Filter the orgData array based on the searchTerm

        // 1. Filter orgData
        const filteredOrgs = orgData.filter((org) => {

            // 2. Combine all searchable text fields into a single string
        const searchableText = 
            org.org_name + org.org_overview; 

            // 3. Check if the searchable text includes the search term
        return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
        });

        // 4. Update the search results state
        setSearchResults(filteredOrgs);
        onSearchResults(filteredOrgs);

        // If no results are found, alert the user
        if (filteredOrgs.length === 0) {
            alert('No results found');
        }

        handleCancelSearch();
    };

    const handleCancelSearch = () => {
        setSearchResults([]); // Clear search results
        setSearchTerm(''); // Clear search term
        onSearchResults(null);
    };
    

    return (
        <div>
            <div class="flex flex-col gap-4 justify-center items-center p-4 my-6 mt-16">

                <div class="relative p-3 border border-gray-200 rounded-lg w-full max-w-lg flex items-center">
                    <input 
                        type="text" 
                        class="rounded-md p-3 w-full" 
                        placeholder="Search by org names or keywords..."
                        value={searchTerm}
                        onChange={handleSearchChange}/>

                    <div class="ml-auto">
                        {/* if search results is null, display search button */}
                        {searchResults.length === 0 && (

                        <button type="submit" class="absolute right-6 top-6" onClick={performSearch}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                stroke="blue" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                        )}

                        {/* if search results is not null, display cancel button */}
                        {searchResults && searchResults.length > 0 && (
                        <button className="absolute right-6 top-6"  onClick={handleCancelSearch}>
                            {/* Cancel */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="5" stroke="red" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                        </button>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}