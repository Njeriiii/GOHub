import React, { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiProvider';
import KeyWordSearch from '../components/KeyWordSearch';
import OrgDisplayCard from '../components/OrgDisplayCard';
import Header from '../components/Header';
import KenyaIcon from '../components/icons/KenyaIcon';
import { Loader2, Search } from 'lucide-react';
import { Translate, DynamicTranslate } from '../contexts/TranslationProvider';

// Component to load all organisations and display their name and an overview
export default function DisplayPage() {
    const apiClient = useApi();

    // State variable to hold fetched data

    const [orgsData, setOrgsData] = useState(null);
    
    // State variable to hold loading status
    const [loading, setLoading] = useState(true);
    
    // State variable to hold search results
    const [searchResults, setSearchResults] = useState(null);
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSearch = (results) => {
        setSearchResults(results);
        if (results) {
            window.scrollTo({ top: document.getElementById('results').offsetTop - 100, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const response = await apiClient.get("/main/orgs");
                if (response.ok) {
                    setOrgsData(response.body);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgs();
    }, [apiClient]);

    const renderOrgCards = (orgs) => {
        if (!orgs?.length) return null;

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orgs.map((org) => (
                    <div key={org.org_id}>
                        <OrgDisplayCard org={org} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-teal-50">
            <Header />
            
            <main className="pb-10">
                {/* Hero Section */}
                <div className="bg-teal-50">
                    <div className="container mx-auto py-16">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
                                <KenyaIcon className="w-8 h-8 text-teal-600" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-4">
                                <Translate>Discover Kenyan Organizations</Translate>
                            </h1>
                            <p className="text-2xl text-teal-600 font-bold">
                                <DynamicTranslate>Connect with community-based organizations making real change happen!</DynamicTranslate>
                            </p>
                        </div>
                    </div>
                    
                    {/* Search Section */}
                    <div className="container mx-auto px-4 relative -mb-8">
                        <div className="max-w-4xl mx-auto">
                            <KeyWordSearch 
                                orgData={orgsData} 
                                onSearchResults={handleSearch}
                                onFilterOpen={setIsFilterOpen}
                            />
                        </div>
                    </div>
                </div>

                <div className="">

                    {/* Results Section */}
                    <section 
                        id="results" 
                        className={`container mx-auto px-4 ${isFilterOpen ? 'mt-32' : 'mt-16'}`}
                    >
                        {/* Results Header */}
                        <div className="bg-white rounded-lg mb-8 border border-slate-200">
                            <div className="px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-bold text-teal-900">
                                            {searchResults 
                                                ? <Translate>Search Results</Translate>
                                                : <Translate>All Organizations</Translate>
                                            }
                                        </h2>
                                        <span className="px-4 py-1.5 text-xl font-bold bg-teal-50 text-teal-600 rounded-full">
                                            {searchResults?.length || orgsData?.length || 0} <Translate>Organization(s)</Translate>
                                        </span>
                                    </div>
                                    {searchResults && (
                                        <button
                                            onClick={() => setSearchResults(null)}
                                            className="inline-flex items-center gap-2 text-xl font-bold 
                                                    text-teal-600 hover:text-teal-700 px-4 py-2 rounded-lg 
                                                    hover:bg-teal-50 transition-colors"
                                        >
                                            <Translate>View All Organizations</Translate>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Results Content */}
                        {loading ? (
                            <div className="bg-white rounded-lg p-12 border border-slate-200">
                                <div className="flex justify-center items-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                                        <p className="text-sm text-gray-500">
                                            <Translate>Loading organizations...</Translate>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : searchResults?.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 border border-slate-200">
                                <div className="max-w-sm mx-auto text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 
                                                rounded-full bg-teal-50 text-teal-600 mb-4">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        <Translate>No results found</Translate>
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        <Translate>Try adjusting your search criteria or explore all available organizations</Translate>
                                    </p>
                                    <button
                                        onClick={() => setSearchResults(null)}
                                        className="px-6 py-2.5 bg-teal-50 text-teal-600 rounded-lg 
                                                hover:bg-teal-100 transition-colors font-medium"
                                    >
                                        <Translate>View All Organizations</Translate>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            renderOrgCards(searchResults || orgsData)
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}