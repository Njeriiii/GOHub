import React from 'react';
import { Translate, DynamicTranslate } from '../contexts/TranslationProvider';
import { Target, Clock, CheckCircle } from "lucide-react";

// This component displays the organization's initiatives and projects.
// It includes fields for the initiative name, description, project name, and description.
export default function OrgProjects({ onboardingFormData }) {
    return (
        <div className="bg-white rounded-xl ">
        <div className="p-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
            <Translate>Our Work</Translate>
            </h2>
            <p className="text-gray-500 mb-8 text-2xl font-medium">
            <DynamicTranslate>
                Explore our initiatives and projects making a difference in the
                community
            </DynamicTranslate>
            </p>

            {/* Program Initiatives Section */}
            {onboardingFormData.orgInitiatives.length > 0 && (
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                <Target className="h-6 w-6 text-teal-600" />
                <h3 className="text-3xl font-semibold text-gray-900">
                    <Translate>Program Initiatives</Translate>
                </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                {onboardingFormData.orgInitiatives.map((initiative, index) => (
                    <div
                        key={index}
                        className="relative bg-white rounded-lg border border-gray-100 p-6 hover: transition duration-200"
                        >
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-t-lg" />
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                <DynamicTranslate>
                                {initiative.initiative_name}
                                </DynamicTranslate>
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-md">
                                <DynamicTranslate>
                                {initiative.initiative_description}
                                </DynamicTranslate>
                            </p>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Ongoing Projects Section */}
            {onboardingFormData.orgProjects.some(
            (project) => project.project_status === "ongoing"
            ) && (
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <h3 className="text-3xl font-semibold text-gray-900">
                        <Translate>Ongoing Projects</Translate>
                    </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                    {onboardingFormData.orgProjects.map(
                        (project, index) =>
                        project.project_status === "ongoing" && (
                            <div
                            key={index}
                            className="relative bg-white rounded-lg border border-gray-100 p-6 hover: transition duration-200"
                            >
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg" />
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                <DynamicTranslate>
                                {project.project_name}
                                </DynamicTranslate>
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-md">
                                <DynamicTranslate>
                                {project.project_description}
                                </DynamicTranslate>
                            </p>
                            <div className="mt-4 flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Translate>In Progress</Translate>
                                </span>
                            </div>
                            </div>
                        )
                    )}
                    </div>
            </div>
            )}

            {/* Completed Projects Section */}
            {onboardingFormData.orgProjects.some(
            (project) => project.project_status === "completed"
            ) && (
            <div>
                <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-3xl font-semibold text-gray-900">
                    <Translate>Completed Projects</Translate>
                </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                {onboardingFormData.orgProjects.map(
                    (project, index) =>
                    project.project_status === "completed" && (
                        <div
                        key={index}
                        className="relative bg-white rounded-lg border border-gray-100 p-6 hover: transition duration-200"
                        >
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-t-lg" />
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">
                            <DynamicTranslate>
                            {project.project_name}
                            </DynamicTranslate>
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-md">
                            <DynamicTranslate>
                            {project.project_description}
                            </DynamicTranslate>
                        </p>
                        <div className="mt-4 flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Translate>Completed</Translate>
                            </span>
                        </div>
                        </div>
                    )
                )}
                </div>
            </div>
        )}
        </div>
        </div>
    );
}