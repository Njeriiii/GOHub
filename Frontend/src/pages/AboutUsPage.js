import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    Users,
    HandHeart,
    HomeIcon,
    Trees} from "lucide-react";
import Header from "../components/Header";

export default function AboutUsPage() {
    const impactAreas = [
        {
        icon: <HandHeart className="h-16 w-8" />,
        area: "Community Support",
        description: "Grassroots initiatives led by local communities",
        },
        {
        icon: <HomeIcon className="h-16 w-8" />,
        area: "Local Development",
        description: "Infrastructure and capacity building projects",
        },
        {
        icon: <Users className="h-16 w-8" />,
        area: "Social Services",
        description: "Health, education, and social welfare programs",
        },
        {
        icon: <Trees className="h-16 w-8" />,
        area: "Sustainable Growth",
        description: "Environmental and economic sustainability initiatives",
        },
    ];

    return (
        <div className="min-h-screen bg-teal-50">
            <Header />

            {/* Main Content Container */}
            <main className="container mx-auto px-4 py-8 space-y-12">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
                        Empowering Kenyan Communities Through Connection
                        </h1>
                        <p className="text-2xl text-gray-900 font-medium">
                        Building digital bridges to strengthen Community Based
                        Organizations across Kenya
                        </p>
                    </div>
                </section>

                {/* CBO Definition Section */}
                <section className="max-w-4xl mx-auto">
                    <Card className="bg-teal-50 border border-teal-300 shadow-md rounded-xl">
                        <CardHeader className="pb-2 text-center">
                        <CardTitle className="text-3xl font-semibold text-teal-900">
                            What is a Community-Based Organization (CBO)?
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-900/80 text-lg leading-relaxed text-center space-y-4">
                        <p className="text-xl font-medium">
                            A <span className="font-bold text-teal-900">Community-Based Organization (CBO)</span> is a nonprofit group 
                            formed and led by local community members to address specific social and economic needs. 
                            CBOs play a key role in grassroots development, providing essential support and 
                            services where they are needed most.
                        </p>
                        <p className="text-xl font-medium">
                            These organizations operate at the community level, focusing on <span className="font-bold text-teal-900">sustainable solutions </span> 
                            and meaningful impact. By working closely with the people they serve, CBOs help drive 
                            long-term progress and positive change.
                        </p>
                        </CardContent>
                    </Card>
                </section>


                {/* Mission Statement */}
                <section className="max-w-4xl mx-auto text-center space-y-4">
                    <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
                    <p className="text-2xl text-gray-600 leading-relaxed font-medium">
                        To empower Kenyan CBOs by providing a collaborative platform that
                        breaks down barriers between organizations, facilitates resource
                        sharing, and amplifies their collective impact. We believe that when
                        local communities connect and work together, they can create
                        sustainable, lasting change from the ground up.
                    </p>
                </section>

                {/* Focus Areas */}
                <section className="space-y-8">
                    <h2 className="text-4xl font-bold text-gray-900 text-center">
                        Supporting Key Community Initiatives
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {impactAreas.map((area, index) => (
                        <Card
                            key={index}
                            className="transform transition-transform hover:scale-105"
                        >
                            <CardContent className="p-6 space-y-4">
                            <div className="flex justify-center text-teal-600">
                                {area.icon}
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-3xl font-semibold text-gray-900">
                                {area.area}
                                </h3>
                                <p className="text-gray-600 text-xl font-medium">{area.description}</p>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </section>

                {/* Vision Section */}
                <section className="max-w-4xl mx-auto text-center space-y-4 pb-12">
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none">
                        <CardHeader>
                        <CardTitle className="text-4xl font-bold text-gray-900">
                            Our Vision for Kenya
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl text-gray-600 leading-relaxed">
                        <p className="font-medium">
                            We envision a Kenya where every community has the tools and
                            connections they need to thrive. By strengthening the network of
                            CBOs, we're helping build a future where local solutions drive
                            national progress, and where every community can learn from and
                            support each other's success.
                        </p>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
};