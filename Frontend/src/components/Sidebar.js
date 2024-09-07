import React from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Sidebar component - renders the organization's contact information
export default function Sidebar({ onboardingFormData }) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
        <ul className="space-y-4">
            <InfoItem icon={EnvelopeIcon} title="Email" content={onboardingFormData.orgProfile.org_email} link={`mailto:${onboardingFormData.orgProfile.org_email}`} />
            <InfoItem icon={PhoneIcon} title="Phone" content={onboardingFormData.orgProfile.org_phone} link={`tel:${onboardingFormData.orgProfile.org_phone}`} />
            <InfoItem icon={MapPinIcon} title="Address" content={`${onboardingFormData.orgProfile.org_district_town}, ${onboardingFormData.orgProfile.org_county}`} />
            <InfoItem icon={GlobeAltIcon} title="Website" content={onboardingFormData.orgProfile.org_website} link={onboardingFormData.orgProfile.org_website} />
            <InfoItem icon={UserGroupIcon} title="Beneficiaries" content={onboardingFormData.orgProfile.org_beneficiaries} />
        </ul>
        <div className="mt-8">
            <a href={`mailto:${onboardingFormData.orgProfile.org_email}`} className="block w-full text-center px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-700 transition duration-300">
            Contact Us
            </a>
        </div>
        </div>
    );
    }

    // InfoItem component - renders a single contact information item
    function InfoItem({ icon: Icon, title, content, link }) {
    const ContentWrapper = link ? 'a' : 'div';
    const wrapperProps = link ? { href: link, className: "block hover:text-teal-600" } : {};

    return (
        <li className="flex items-start">
        <Icon className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
        <div>
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            <ContentWrapper {...wrapperProps}>
            <p className="mt-1 text-sm text-gray-700">{content}</p>
            </ContentWrapper>
        </div>
        </li>
    );
}