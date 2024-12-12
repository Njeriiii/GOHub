import React, { useState, useEffect } from 'react';
import { PencilIcon, MapPinIcon, EnvelopeIcon, BriefcaseIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import Header from '../components/Header';
import OrgDisplayCard from '../components/OrgDisplayCard';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';
import { Translate, DynamicTranslate } from '../contexts/TranslationProvider';

export default function VolunteerPage() {
    const [matchedOrgs, setMatchedOrgs] = useState([]);
    const [volunteerInfo, setVolunteerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiClient = useApi();
    const { getUserId } = useAuth();
    const [showAllSkills, setShowAllSkills] = useState(false);

    // Get the userId from the API context
    const userId = getUserId();

    useEffect(() => {
        const fetchData = async () => {

            try {
                const [matchResponse, volunteerResponse] = await Promise.all([
                    apiClient.get(`/main/match-skills?user_id=${userId}`),
                    apiClient.get(`/profile/volunteer?user_id=${userId}`)
                ]);

                if (!matchResponse.ok || !volunteerResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const matchData = await matchResponse.body;
                const volunteerData = await volunteerResponse.body;

                setMatchedOrgs(matchData.matches || []);
                setVolunteerInfo(volunteerData.volunteer || null);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, apiClient]);

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-600"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-screen">
                    {/* <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div> */}

                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-teal-600"><Translate>Please sign up as a volunteer to access volunteering opportunities!</Translate></h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">1</span>
                                <span><Translate>Update your skills profile to include more areas you're interested in.</Translate></span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">2</span>
                                <span><Translate>Expand your search criteria, such as considering remote opportunities.</Translate></span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">3</span>
                                <span><Translate>Check back regularly, as new opportunities are added frequently.</Translate></span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">4</span>
                                <span><Translate>Consider gaining new skills through online courses or workshops.</Translate></span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">5</span>
                                <span><Translate>Reach out to our support team for personalized assistance in finding opportunities.</Translate></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8"><Translate>Volunteer Dashboard</Translate></h1>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left column: Volunteer Info */}
                    <div className="lg:w-1/3">
                        {volunteerInfo && (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="bg-teal-600 text-white p-4">
                                    <h2 className="text-2xl font-semibold">{volunteerInfo.first_name} {volunteerInfo.last_name}</h2>
                                    {volunteerInfo.is_admin && <p className="text-teal-100"><Translate>Admin</Translate></p>}
                                    {!volunteerInfo.is_admin && <p className="text-teal-100"><Translate>Volunteer</Translate></p>}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <p className="text-gray-600">{volunteerInfo.email}</p>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <p className="text-gray-600">{volunteerInfo.location || 'Not specified'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold mb-2 flex items-center">
                                            <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <Translate>
                                            Your Skills
                                            </Translate></h3>
                                        <ul className="space-y-2">
                                            {volunteerInfo.skills && volunteerInfo.skills.slice(0, showAllSkills ? undefined : 5).map((skill) => (
                                                <li key={skill.skill_id} className="bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-sm inline-block mr-2 mb-2">
                                                <DynamicTranslate>
                                                    {skill.skill}
                                                </DynamicTranslate>
                                                </li>
                                            ))}
                                        </ul>
                                        {volunteerInfo.skills && volunteerInfo.skills.length > 5 && (
                                            <button
                                                onClick={() => setShowAllSkills(!showAllSkills)}
                                                className="text-teal-600 hover:text-teal-800 text-sm font-medium mt-2 flex items-center"
                                            >
                                                {showAllSkills ? (
                                                    <>Show Less <ChevronUpIcon className="h-4 w-4 ml-1" /></>
                                                ) : (
                                                    <>Show More <ChevronDownIcon className="h-4 w-4 ml-1" /></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full flex items-center">
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        <Translate>
                                        Edit Profile
                                        </Translate>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column: Matched Organizations */}
                    <div className="lg:w-2/3">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4"><Translate>Matched Organizations</Translate></h2>
                        <div className="">
                            <div className="grid gap-6">
                                    {matchedOrgs.map((org) => (
                                        <OrgDisplayCard key={org.org_id} org={org} />
                                    ))}
                            </div>
                        </div>
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4 text-teal-600"><Translate>Here are some steps to increase your matches</Translate></h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">1</span>
                                        <span><Translate>Update your skills profile to include more areas you're interested in.</Translate></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">2</span>
                                        <span><Translate>Expand your search criteria, such as considering remote opportunities.</Translate></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">3</span>
                                        <span><Translate>Check back regularly, as new opportunities are added frequently.</Translate></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">4</span>
                                        <span><Translate>Consider gaining new skills through online courses or workshops.</Translate></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">5</span>
                                        <span><Translate>Reach out to our support team for personalized assistance in finding opportunities.</Translate></span>
                                    </li>
                                </ul>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}