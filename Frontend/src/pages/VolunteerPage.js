import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';
import { DynamicTranslate, Translate } from '../contexts/TranslationProvider';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    VolunteerMainCard,
} from "../components/ui/card";
import {
    Mail,
    Briefcase,
    ChevronDown,
    ChevronUp,
    Pencil,
    User,
    BadgeCheck,
    Sparkles,
    Target,
    Users,
} from "lucide-react";
import { Loader2 } from 'lucide-react';
import Header from '../components/Header';
import OrgDisplayCard from '../components/OrgDisplayCard';
import {
    techSkillOptions,
    nonTechSkillOptions,
} from "../components/utils/supportNeedsFocusAreaEntries";

const messages = [
    <DynamicTranslate>If you're not a volunteer yet, sign up!</DynamicTranslate>,
    <Translate>Update your skills profile to include more areas you're interested in</Translate>,
    <Translate>Expand your search criteria, such as considering remote opportunities</Translate>,
    <Translate>Check back regularly, as new opportunities are added frequently.</Translate>,
    <Translate>Consider gaining new skills through online courses or workshops.</Translate>,
    <Translate>Reach out to our support team for personalized assistance in finding opportunities.</Translate>
];

export default function VolunteerDashboard() {
    const [matchedOrgs, setMatchedOrgs] = useState([]);
    const [volunteerInfo, setVolunteerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllSkills, setShowAllSkills] = useState(false);
    const apiClient = useApi();
    const { getUserId } = useAuth();
    const userId = getUserId();

    // Create a map of all possible skills for label lookup
    const allSkillOptions = [...techSkillOptions, ...nonTechSkillOptions];
    const skillLabelMap = Object.fromEntries(
        allSkillOptions.map(option => [option.value.toLowerCase(), option.label])
    );

    const getSkillLabel = (skillValue) => {
        return skillLabelMap[skillValue.toLowerCase()] || skillValue;
    };

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

                setMatchedOrgs(matchResponse.body.matches || []);
                setVolunteerInfo(volunteerResponse.body.volunteer || null);
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
            <div className="min-h-screen bg-teal-50">
                <Header />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-teal-50">
                <Header />
                <div className="container mx-auto px-4 py-16">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Translate>Please complete your volunteer profile</Translate>
                            </CardTitle>
                            <CardDescription>
                                <Translate>Follow these steps to get started</Translate>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-medium">
                                            {index + 1}
                                        </div>
                                        <p className="text-gray-600">{message}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-teal-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div>
                        {volunteerInfo && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-teal-50 rounded-full">
                                            <User className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <CardTitle>{volunteerInfo.first_name} {volunteerInfo.last_name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 font-medium">
                                                {volunteerInfo.is_admin && <BadgeCheck className="w-4 h-4" />}
                                                <span>{volunteerInfo.is_admin ? <Translate>Admin</Translate> : <Translate>Volunteer</Translate>}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{volunteerInfo.email}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Briefcase className="w-4 h-4 text-gray-600" />
                                            <h3 className="font-medium">
                                                <Translate>Skills</Translate>
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {volunteerInfo.skills?.slice(0, showAllSkills ? undefined : 5).map((skill) => (
                                                <span 
                                                    key={skill.skill_id} 
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-lg font-bold bg-teal-50 text-teal-600"
                                                >
                                                    {getSkillLabel(skill.skill)}
                                                </span>
                                            ))}
                                        </div>
                                        {volunteerInfo.skills?.length > 5 && (
                                            <button
                                                onClick={() => setShowAllSkills(!showAllSkills)}
                                                className="mt-3 flex items-center text-m text-teal-600 hover:text-teal-700"
                                            >
                                                {showAllSkills ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4 mr-1" />
                                                        <Translate>Show Less</Translate>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4 mr-1" />
                                                        <Translate>Show More</Translate>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Quick Stats */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-xl"><Translate>Your Potential for Impact</Translate></CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-teal-50 rounded-lg text-center">
                                                <Sparkles className="w-5 h-5 text-teal-600 mx-auto mb-2" />
                                                <div className="text-3xl font-bold text-teal-700">{volunteerInfo?.skills?.length || 0}</div>
                                                <div className="text-m text-teal-600"><Translate>Skills</Translate></div>
                                            </div>
                                            <div className="p-4 bg-teal-50 rounded-lg text-center">
                                                <Target className="w-5 h-5 text-teal-600 mx-auto mb-2" />
                                                <div className="text-3xl font-bold text-teal-700">{matchedOrgs.length}</div>
                                                <div className="text-m text-teal-600"><Translate>Matches</Translate></div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <button 
                                        className="w-full flex items-center justify-center gap-2 py-2 text-m font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                                        onClick={() => window.location.href = '/profile/edit'}
                                    >
                                        <Pencil className="w-4 h-4" />
                                        <Translate>Edit Profile</Translate>
                                    </button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        <VolunteerMainCard className="bg-teal-50">
                            <CardHeader>
                                <div className="flex items-center bg-teal-50">
                                    <Users className="w-10 h-5 text-teal-600" />
                                    <div>
                                        <CardTitle className='font-bold'><Translate>Matched Organizations</Translate></CardTitle>
                                        <CardDescription className='font-medium text-xl'>
                                            {matchedOrgs.length} <Translate>organizations match your skills</Translate>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 bg-teal-50">
                                    {matchedOrgs.map((org) => (
                                        <OrgDisplayCard key={org.org_id} org={org} />
                                    ))}
                                    {matchedOrgs.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <Translate>No matching organizations found yet. Try updating your skills!</Translate>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </VolunteerMainCard>

                        <Card>
                            <CardHeader>
                                <CardTitle><Translate>Tips to Find More Matches</Translate></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {messages.map((message, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-medium">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-600 text-lg">{message}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}