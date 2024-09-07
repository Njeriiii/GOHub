import React, { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiProvider';
import KeyWordSearch from '../components/KeyWordSearch';
import OrgDisplayCard from '../components/OrgDisplayCard';
import Header from '../components/Header';

// Component to load all organisations and display their name and an overview
export default function DisplayPage() {
    const apiClient = useApi();

    // State variable to hold fetched data

    const [orgsData, setOrgsData] = useState(null);
    
    // State variable to hold loading status
    const [loading, setLoading] = useState(true);
    
    // State variable to hold search results
    const [searchResults, setSearchResults] = useState(null);
    
    // State variable to hold active tab - featured, all, or search
    const [activeTab, setActiveTab] = useState('featured');

    const handleSearch = (results) => {
        setSearchResults(results);
        setActiveTab('search');
    };

    useEffect(() => {
        apiClient.get("/main/orgs")
            .then((response) => {
                if (response.ok) {
                    setOrgsData(response?.body);
                    setLoading(false);
                } else {
                    console.error("Error fetching data: ", response.body);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, [apiClient]);

    const renderOrgCards = (orgs) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgs.map((org) => (
                <OrgDisplayCard key={org.org_id} org={org} />
            ))}
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Discover Kenyan Grassroots Organizations</h1>
                    <p className="text-gray-600 mb-6">Connect with community-based charities making a difference across Kenya.</p>
                    <KeyWordSearch orgData={orgsData} onSearchResults={handleSearch} />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex mb-6 space-x-4">
                        {['featured', 'all', 'search'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
                                onClick={() => setActiveTab(tab)}
                                disabled={tab === 'search' && !searchResults}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'featured' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Organizations</h2>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                renderOrgCards(orgsData.slice(0, 6))
                            )}
                        </div>
                    )}

                    {activeTab === 'all' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Organizations</h2>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                renderOrgCards(orgsData)
                            )}
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Results</h2>
                            {searchResults && searchResults.length > 0 ? (
                                renderOrgCards(searchResults)
                            ) : (
                                <p className="text-gray-600">No results found. Try a different search term.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}