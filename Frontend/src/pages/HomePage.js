import React, { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiProvider';
import OrgDisplayCard from '../components/OrgDisplayCard';
import Header from '../components/Header';
import KenyaIcon from '../components/icons/KenyaIcon';
import { DynamicTranslate } from '../contexts/TranslationProvider';
import { Loader2, Users, Lightbulb, ArrowRight, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function HomePage() {
    const apiClient = useApi();
    const [orgsData, setOrgsData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const renderFeaturedOrgs = (orgs) => {
        if (!orgs?.length) return null;

        // Only show first 2 organizations
        const featuredOrgs = orgs.slice(0, 2);

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredOrgs.map((org) => (
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

            <main>
                {/* Hero Section */}
                <div className="bg-teal-900">
                    <div className="container mx-auto px-4 py-20">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
                                <KenyaIcon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                <DynamicTranslate>Uniting Communities Across Kenya</DynamicTranslate>
                            </h1>
                            <p className="text-2xl text-white/90 mb-8 font-medium">
                                <DynamicTranslate>Connect with community-based organizations making real change happen!</DynamicTranslate>
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button 
                                    variant="info"
                                    size="lg"
                                    className="text-teal-600 bg-teal-800"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    <DynamicTranslate>Explore CBOs</DynamicTranslate>
                                </Button>
                                <Button 
                                    variant="info"
                                    size="lg"
                                    className="text-teal-600  bg-teal-800"
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    <DynamicTranslate>Become a Volunteer</DynamicTranslate>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="p-4">
                            <CardContent className="p-6">
                                <Lightbulb className="w-8 h-8 text-teal-600 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    <DynamicTranslate>Founder's Corner</DynamicTranslate>
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    <DynamicTranslate>Resources, guides, and support for CBO founders and leaders</DynamicTranslate>
                                </p>
                                <Button variant="link" className="text-teal-600 p-0">
                                    <DynamicTranslate>Access Resources</DynamicTranslate>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="p-4">
                            <CardContent className="p-6">
                                <Users className="w-8 h-8 text-teal-600 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    <DynamicTranslate>Volunteer Platform</DynamicTranslate>
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    <DynamicTranslate>Make a difference by volunteering with local organizations</DynamicTranslate>
                                </p>
                                <Button variant="link" className="text-teal-600 p-0">
                                    <DynamicTranslate>Start Volunteering</DynamicTranslate>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="p-4">
                            <CardContent className="p-6">
                                <Search className="w-8 h-8 text-teal-600 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    <DynamicTranslate>Find Organizations</DynamicTranslate>
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    <DynamicTranslate>Discover and connect with CBOs making an impact</DynamicTranslate>
                                </p>
                                <Button variant="link" className="text-teal-600 p-0" href="/find-gos">
                                    <DynamicTranslate>View All CBOs</DynamicTranslate>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Featured Organizations */}
                <div className="container mx-auto px-4 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">
                            <DynamicTranslate>Featured Organizations</DynamicTranslate>
                        </h2>
                        <Button variant="outline" href="/find-gos">
                            <DynamicTranslate>View All</DynamicTranslate>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-lg p-12 border border-slate-200">
                            <div className="flex justify-center items-center">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                                    <p className="text-sm text-gray-500">
                                        <DynamicTranslate>Loading organizations...</DynamicTranslate>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 bg-teal-50">
                            {renderFeaturedOrgs(orgsData)}
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="bg-teal-50">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                <DynamicTranslate>Ready to Make an Impact?</DynamicTranslate>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 font-medium">
                                <DynamicTranslate>
                                    Whether you're a CBO founder, volunteer, or supporter, 
                                    join our platform to connect and create positive change.
                                </DynamicTranslate>
                            </p>
                            <Button size="lg" className="bg-teal-600 hover:bg-teal-700" href="/signup">
                                <DynamicTranslate>Get Started</DynamicTranslate>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}