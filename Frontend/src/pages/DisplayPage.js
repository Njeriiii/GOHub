import react, {useEffect, useState} from 'react';
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
    const [isElevated, setIsElevated] = useState(false);

    const handleSearch = (results) => {

        // if results is null, clear search results
        if (!results) {
            setSearchResults(null);
            setIsElevated(false); // Hide results area
            return;
        }
        // Update search results
        setSearchResults(results);
        
        // Set isElevated to true after the state is updated
        setIsElevated(true); // Show results area
    };

    // Fetch all organisations from the backend
    useEffect(() => {
        // Fetch all organisations from the backend
        // Display the name and an overview of each organisation
        apiClient.get("/main/orgs")
        .then((response) => {

            if (response.ok) {
                setOrgsData(response?.body);
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
    }
    , [apiClient]);

return (
    <div class="bg-gray-100 texture-subtle min-h-screen py-12">
        <div>
            <Header />
        </div>
    
        <div className="">

            <KeyWordSearch orgData={orgsData} onSearchResults={handleSearch} />

            {isElevated ? (
                <div className="p-2">
                    <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                    {searchResults.map((org) => (
                        <OrgDisplayCard key={org.org_id} org={org} />
                    ))}
                </div>

            ) : (

                <div>
                    {loading ? (
                        <p>Loading organisations...</p>
                    ) : (
                        <div>
                            {orgsData.map((org) => (
                                <OrgDisplayCard key={org.org_id} org={org} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);
}