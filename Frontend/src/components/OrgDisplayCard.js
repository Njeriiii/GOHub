import React from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Calendar } from 'lucide-react';

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

    function handleProfileLinkClick(org) {
        navigate('/org_profile', { state: { org } });
    }

    const categoryColor = categoryColors[org.category?.toLowerCase()] || categoryColors.default;

    return (
        <div 
            className="m-4 bg-slate-50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] cursor-pointer border-l-4 border-teal-800"
            onClick={() => handleProfileLinkClick(org)}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-teal-900 mb-2">{org.org_name}</h2>
                    <span className={`px-3 py-1 ${categoryColor} text-sm font-semibold rounded-full`}>
                    <div className="flex flex-wrap items-center">
                        {org.focus_areas.map((focus_area, index) => (
                            <React.Fragment key={focus_area.id}>
                                <span 
                                    className={`px-3 py-1 ${categoryColor} text-sm font-semibold rounded-full`}
                                    title={focus_area.description || focus_area.name}
                                >
                                    {focus_area.name}
                                </span>
                                {index < org.focus_areas.length - 1 && (
                                    <span className="mx-1 text-gray-400">•</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{org.org_overview}</p>
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-2 text-teal-600" />
                        <span>{org.location || 'Location N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Users size={18} className="mr-2 text-teal-600" />
                        <span>{org.beneficiaries || 'Beneficiaries N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar size={18} className="mr-2 text-teal-600" />
                        <span>{org.established || 'Est. N/A'}</span>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleProfileLinkClick(org);
                        }}
                    >
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}