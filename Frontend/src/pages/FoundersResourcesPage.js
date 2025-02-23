import React from "react";
import { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../components/ui/card";
import { BookOpen, FileText, ArrowRight, Building2 } from "lucide-react";
import Header from "../components/Header";
import OrgDisplayCard from "../components/OrgDisplayCard";

const OrgViewSection = ({ loading, onboardingFormData }) => {
    return (
        <div className="max-w-3xl mx-auto bg-white rounded-m p-6">
            <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">View your Organization's Profile</h2>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-500 border-t-transparent"></div>
                </div>
            ) : (
                <OrgDisplayCard org={onboardingFormData.orgProfile} />
            )}
        </div>
    );
};

export default function FoundersResourcesPage () {

    const apiClient = useApi();
    const { user } = useAuth();
    const userId = user.id;
    const [onboardingFormData, setOnboardingFormData] = useState(null);
    const [loading, setLoading] = useState(true);

  // Define resources with their details
    const resources = [
        {
        name: "Establishment Guide",
        description:
            "Step-by-step guidance for establishing and registering your non-profit organization. Learn about legal requirements, documentation, and best practices.",
        href: "/establishment-guide",
        icon: BookOpen,
        },
        {
        name: "Proposal Builder",
        description:
            "Interactive tool to help you create compelling grant proposals. Includes templates, examples, and tips for successful fundraising.",
        href: "/proposal-builder",
        icon: FileText,
        },
    ];

    useEffect(() => {    
        apiClient.get(`/profile/load_org?user_id=${userId}`)
            .then((response) => {
                if (response.ok) {
                    setOnboardingFormData(response.body);
                    setLoading(false);
                } else {
                    console.error("Error fetching data: ", response.body);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
        }, [apiClient, userId]);

    return (
        <div className="min-h-screen bg-teal-50">
        <Header />
        {/* Header Section */}
        <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-10 m-5">Founder's Resources</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Access our comprehensive collection of tools and guides designed to
            help you establish and grow your non-profit organization.
            </p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resources.map((resource) => {
            const Icon = resource.icon;
            return (
                <a
                key={resource.href}
                href={resource.href}
                className="block no-underline"
                >
                <Card className="h-full transition-all duration-300">
                    <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-100 rounded-lg">
                        <Icon className="h-6 w-6 text-teal-600" />
                        </div>
                        <CardTitle className="text-xl">{resource.name}</CardTitle>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <CardDescription className="text-base font-medium">
                        {resource.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-teal-600">
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                    </CardContent>
                </Card>
                </a>
            );
            })}
        </div>

        <div className="lg:col-span-1 max-w-3xl mx-auto mt-10 border-t border-gray-200 pt-8">
            <OrgViewSection loading={loading} onboardingFormData={onboardingFormData}/>
        </div>
        </div>
    );
};