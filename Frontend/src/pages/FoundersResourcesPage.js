import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../components/ui/card";
import { BookOpen, FileText, ArrowRight } from "lucide-react";
import Header from "../components/Header";

export default function FoundersResourcesPage () {
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
        </div>
    );
};