import React from 'react';
import { 
    MapPinIcon, 
    PhoneIcon, 
    EnvelopeIcon, 
    GlobeAltIcon, 
    BuildingOfficeIcon,
    DocumentTextIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { Translate } from '../contexts/TranslationProvider';
import { 
    Facebook, 
    Instagram, 
    Linkedin, 
    Youtube, 
} from 'lucide-react';

// Helper function to get coordinates from Google Maps URL
function getCoordinates(url) {
    try {
        // Regex to extract coordinates from Google Maps URL
        const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || 
                    url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])];
        }
        // Default to Githunguri coordinates if parsing fails
        return [-1.0586336, 36.7779108];
    } catch (error) {
        console.error('Error parsing Google Maps URL:', error);
        return [-1.0586336, 36.7779108];
    }
}

// Static Map component
function StaticMap({ googleMapsUrl }) {
    const [lat, lng] = getCoordinates(googleMapsUrl);

    // Adjust bounding box for a zoomed-in view
    const zoomFactor = 0.002; // Smaller value = more zoomed in
    const staticMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - zoomFactor},${lat - zoomFactor},${lng + zoomFactor},${lat + zoomFactor}&layer=mapnik&marker=${lat},${lng}`;

    return (
        <div className="relative w-full h-[200px]">
            {/* Embed OpenStreetMap */}
            <iframe
                src={staticMapUrl}
                width="600"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
                title="Static Map"
            ></iframe>
        </div>
    );
}

// InfoItem component - renders a single contact information item
function InfoItem({ icon: Icon, title, content, link }) {
    if (!content) return null;
    
    const ContentWrapper = link ? 'a' : 'div';
    const wrapperProps = link ? { 
        href: link, 
        className: "block hover:text-teal-600",
        target: link.startsWith('http') ? '_blank' : undefined,
        rel: link.startsWith('http') ? 'noopener noreferrer' : undefined
    } : {};

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

// Social media icon component
function SocialIcon({ icon: Icon, href, color = "text-gray-600" }) {
    if (!href) return null;

    return (
        <a 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${color} hover:text-teal-600 transition-colors`}
        >
            <Icon className="h-6 w-6" />
        </a>
    );
}

// Sidebar component - renders the organization's contact information
export default function Sidebar({ onboardingFormData }) {
    const fullAddress = [
        onboardingFormData.orgProfile.org_physical_description,
        onboardingFormData.orgProfile.org_district_town,
        onboardingFormData.orgProfile.org_county,
        onboardingFormData.orgProfile.org_country,
        onboardingFormData.orgProfile.org_po_box
    ].filter(Boolean).join(', ');

    // Custom X (Twitter) icon since Lucide might not have the new X logo
    const XIcon = () => (
        <svg 
            className="h-5 w-5"
            viewBox="0 0 24 24" 
            fill="currentColor"
            stroke="none"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                <Translate>Contact Information</Translate>
            </h2>
            
            <ul className="space-y-4">
                <InfoItem 
                    icon={BuildingOfficeIcon}
                    title={<Translate>Organization</Translate>}
                    content={onboardingFormData.orgProfile.org_name}
                />

                <InfoItem 
                    icon={EnvelopeIcon}
                    title={<Translate>Email</Translate>}
                    content={onboardingFormData.orgProfile.org_email}
                    link={`mailto:${onboardingFormData.orgProfile.org_email}`}
                />
                
                <InfoItem 
                    icon={PhoneIcon}
                    title={<Translate>Phone</Translate>}
                    content={onboardingFormData.orgProfile.org_phone}
                    link={`tel:${onboardingFormData.orgProfile.org_phone}`}
                />
                
                <InfoItem 
                    icon={MapPinIcon}
                    title={<Translate>Address</Translate>}
                    content={fullAddress}
                    link={onboardingFormData.orgProfile.org_google_maps_link}
                />
                
                <InfoItem 
                    icon={GlobeAltIcon}
                    title={<Translate>Website</Translate>}
                    content={onboardingFormData.orgProfile.org_website}
                    link={onboardingFormData.org_website}
                />
                
                <InfoItem 
                    icon={DocumentTextIcon}
                    title={<Translate>Registration Number</Translate>}
                    content={onboardingFormData.orgProfile.org_registration_number}
                />
                
                <InfoItem 
                    icon={CalendarIcon}
                    title={<Translate>Established</Translate>}
                    content={onboardingFormData.orgProfile.org_year_established}
                />
            </ul>

            <div className="mt-8">
                <a 
                    href={`mailto:${onboardingFormData.orgProfile.org_email}`}
                    className="block w-full text-center px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-700 transition duration-300"
                >
                    <Translate>Contact Us</Translate>
                </a>
            </div>

            {onboardingFormData.orgProfile.org_google_maps_link && (
                <div className="mt-4">
                    <div className="w-full overflow-hidden">
                        <StaticMap googleMapsUrl={onboardingFormData.orgProfile.org_google_maps_link} />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            <a 
                                href={onboardingFormData.orgProfile.org_google_maps_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline text-xl font-semibold text-teal-600"
                            >
                                View larger map
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Media Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    <Translate>Follow Us</Translate>
                </h3>
                <div className="flex items-center space-x-4">
                    <SocialIcon 
                        icon={Facebook} 
                        href={onboardingFormData.orgProfile.org_facebook}
                        color="text-blue-600"
                    />
                    <SocialIcon 
                        icon={Instagram} 
                        href={onboardingFormData.orgProfile.org_instagram}
                        color="text-pink-600"
                    />
                    <SocialIcon 
                        icon={XIcon} 
                        href={onboardingFormData.orgProfile.org_x}
                        color="text-gray-800"
                    />
                    <SocialIcon 
                        icon={Linkedin} 
                        href={onboardingFormData.orgProfile.org_linkedin}
                        color="text-blue-700"
                    />
                    <SocialIcon 
                        icon={Youtube} 
                        href={onboardingFormData.orgProfile.org_youtube}
                        color="text-red-600"
                    />
                </div>
            </div>
        </div>
    );
}
