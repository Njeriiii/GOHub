import React from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Calendar } from 'lucide-react';
import { Translate, DynamicTranslate } from '../contexts/TranslationProvider';

const categoryColors = {
    default: 'bg-teal-100 text-teal-800',
    education: 'bg-blue-100 text-blue-800',
    health: 'bg-rose-100 text-rose-800',
    environment: 'bg-green-100 text-green-800',
    community: 'bg-purple-100 text-purple-800',
    // Add more categories as needed
};

// Organization display card component - used to display organization information in a card format
export default function OrgDisplayCard({ org }) {
    const navigate = useNavigate();
    const categoryColor = categoryColors[org.category?.toLowerCase()] || categoryColors.default;

    const handleProfileLinkClick = (e, org) => {
        e.stopPropagation();
        navigate('/org_profile', { state: { org } });
    };

    const getAbbreviation = (name) => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 3)
        .toUpperCase();
    };


    return (
        <div 
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            onClick={(e) => handleProfileLinkClick(e, org)}
        >
            {/* Card Header with Logo and Category Tags */}
            <div className="p-6 flex flex-col sm:flex-row gap-6">
                {/* Organization Logo */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {org.org_logo_filename ? (
                            <img 
                                src={org.org_logo_filename} 
                                alt={`${org.org_name} Logo`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                        <span className="text-gray-400 text-sm font-medium">
                                            ${org.org_name.substring(0, 2).toUpperCase()}
                                        </span>
                                    `;
                                }}
                            />
                        ) : (
                            <span className="text-gray-400 text-sm font-medium">
                                {getAbbreviation(org.org_name)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Organization Info */}
                <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {org.org_name}
                    </h2>
                    
                    {/* Focus Areas */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {org.focus_areas.map((focus_area, index) => (
                            <span 
                                key={focus_area.id}
                                className={`px-3 py-1 text-sm font-medium rounded-full border ${categoryColor}`}
                                title={focus_area.description}
                            >
                                <DynamicTranslate>{focus_area.name}</DynamicTranslate>
                            </span>
                        ))}
                    </div>

                    {/* Organization Overview */}
                    <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2 sm:line-clamp-3">
                        <DynamicTranslate>{org.org_overview}</DynamicTranslate>
                    </p>
                </div>
            </div>

            {/* Card Footer with Metadata and CTA */}
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm truncate">
                            <DynamicTranslate>{org.location || 'Location N/A'}</DynamicTranslate>
                        </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm truncate">
                            <DynamicTranslate>{org.beneficiaries || 'Beneficiaries N/A'}</DynamicTranslate>
                        </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm truncate">
                            <DynamicTranslate>{org.established || 'Est. N/A'}</DynamicTranslate>
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-end">
                    <button
                        className="group-hover:bg-teal-600 bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        onClick={(e) => handleProfileLinkClick(e, org)}
                    >
                        <Translate>View Profile</Translate>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}