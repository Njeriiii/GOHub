import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    Users,
    HandHeart,
    HomeIcon,
    Trees} from "lucide-react";
import Header from "../components/Header";
import { DynamicTranslate } from "../contexts/TranslationProvider";

export default function AboutUsPage() {
    const impactAreas = [
        {
        icon: <HandHeart className="h-16 w-8" />,
        area: <DynamicTranslate>Community Support</DynamicTranslate>,
        description:<DynamicTranslate>Grassroots initiatives led by local communities</DynamicTranslate>,
        },
        {
        icon: <HomeIcon className="h-16 w-8" />,
        area:<DynamicTranslate>Local Development</DynamicTranslate>,
        description:<DynamicTranslate>Infrastructure and capacity building projects</DynamicTranslate>,
        },
        {
        icon: <Users className="h-16 w-8" />,
        area:<DynamicTranslate>Social Services</DynamicTranslate>,
        description:<DynamicTranslate>Health, education, and social welfare programs</DynamicTranslate>,
        },
        {
        icon: <Trees className="h-16 w-8" />,
        area:<DynamicTranslate>Sustainable Growth</DynamicTranslate>,
        description:<DynamicTranslate>Environmental and economic sustainability initiatives</DynamicTranslate>,
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
                            <DynamicTranslate>Empowering Kenyan Communities Through Connection</DynamicTranslate>
                        </h1>
                        <p className="text-2xl text-gray-900 font-medium">
                            <DynamicTranslate>
                            Building digital bridges to strengthen Community Based
                            Organizations across Kenya
                            </DynamicTranslate>
                        </p>
                    </div>
                </section>

                {/* CBO Definition Section */}
                <section className="max-w-4xl mx-auto">
                    <Card className="bg-teal-50 border border-teal-300 shadow-md rounded-xl">
                        <CardHeader className="pb-2 text-center">
                            <CardTitle className="text-3xl font-semibold text-teal-900">
                                <DynamicTranslate>What is a Community-Based Organization (CBO)?</DynamicTranslate>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-900/80 text-lg leading-relaxed text-center space-y-4">
                            <p className="text-xl font-medium">
                                <DynamicTranslate>
                                    A Community-Based Organization (CBO) is a non-profit group 
                                    formed and led by local community members to address specific social and economic needs. 
                                    CBOs play a key role in grassroots development, providing essential support and 
                                    services where they are needed most.
                                </DynamicTranslate>
                            </p>
                            <p className="text-xl font-medium">
                                <DynamicTranslate>
                                    These organizations operate at the community level, focusing on sustainable solutions
                                    and meaningful impact. By working closely with the people they serve, CBOs help drive 
                                    long-term progress and positive change.
                                </DynamicTranslate>
                            </p>
                        </CardContent>
                    </Card>
                </section>


                {/* Mission Statement */}
                <section className="max-w-4xl mx-auto text-center space-y-4">
                    <h2 className="text-4xl font-bold text-gray-900">
                        <DynamicTranslate>Our Mission</DynamicTranslate>
                    </h2>
                    <p className="text-2xl text-gray-600 leading-relaxed font-medium">
                        <DynamicTranslate>
                            To empower Kenyan CBOs by providing a collaborative platform that
                            breaks down barriers between organizations, facilitates resource
                            sharing, and amplifies their collective impact. We believe that when
                            local communities connect and work together, they can create
                            sustainable, lasting change from the ground up.
                        </DynamicTranslate>
                    </p>
                </section>

                {/* Focus Areas */}
                <section className="space-y-8">
                    <h2 className="text-4xl font-bold text-gray-900 text-center">
                        <DynamicTranslate>Supporting Key Community Initiatives</DynamicTranslate>
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
                                <DynamicTranslate>Our Vision for Kenya</DynamicTranslate>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl text-gray-600 leading-relaxed">
                        <p className="font-medium">
                            <DynamicTranslate>
                                We envision a Kenya where every community has the tools and
                                connections they need to thrive. By strengthening the network of
                                CBOs, we're helping build a future where local solutions drive
                                national progress, and where every community can learn from and
                                support each other's success.
                            </DynamicTranslate>
                        </p>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
};