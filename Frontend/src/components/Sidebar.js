import React from "react";
import { Translate } from "../contexts/TranslationProvider";
import { 
    Building2,
    Phone,
    Mail,
    MapPin,
    Globe,
    FileText,
    Calendar,
    Facebook, 
    Instagram, 
    Linkedin, 
    Youtube, 
    ExternalLink,
} from "lucide-react";

// InfoItem component with improved styling
function InfoItem({ icon: Icon, title, content, link }) {
    if (!content) return null;

    const ContentWrapper = link ? "a" : "div";
    const wrapperProps = link ? { 
        href: link, 
        className: "group block text-gray-600 hover:text-teal-600 transition-colors duration-200",
        target: link.startsWith("http") ? "_blank" : undefined,
        rel: link.startsWith("http") ? "noopener noreferrer" : undefined,
    } : {};

    return (
        <li className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <div className="flex-shrink-0">
            <Icon className="h-5 w-5 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-m font-medium text-gray-900">{title}</h3>
            <ContentWrapper {...wrapperProps}>
            <div className="mt-1 text-m break-words">
                {content}
                {link && link.startsWith("http") && (
                <ExternalLink className="inline-block ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>
            </ContentWrapper>
        </div>
        </li>
    );
}

// Social media icon component
function SocialIcon({ icon: Icon, href, label }) {
    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="rounded-lg p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200"
        >
            <Icon className="h-5 w-5" />
        </a>
    );
}

    // Custom X (Twitter) icon
    const XIcon = () => (
    <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
    );

// Main Sidebar component
export default function Sidebar({ onboardingFormData }) {
    const { orgProfile } = onboardingFormData;

    const fullAddress = [
        orgProfile.org_physical_description,
        orgProfile.org_district_town,
        orgProfile.org_county,
        orgProfile.org_country,
        orgProfile.org_po_box,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="bg-white rounded-xl divide-y divide-gray-100">
        {/* Contact Information Section */}
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                <Translate>Contact Information</Translate>
            </h2>

            <ul className="space-y-1">
            <InfoItem
                icon={Building2}
                title={<Translate>Organization</Translate>}
                content={orgProfile.org_name}
            />

            <InfoItem
                icon={Mail}
                title={<Translate>Email</Translate>}
                content={orgProfile.org_email}
                link={`mailto:${orgProfile.org_email}`}
            />
                
                <InfoItem
                icon={Phone}
                title={<Translate>Phone</Translate>}
                content={orgProfile.org_phone}
                link={`tel:${orgProfile.org_phone}`}
            />
                
            <InfoItem
                icon={MapPin}
                title={<Translate>Address</Translate>}
                content={fullAddress}
                link={orgProfile.org_google_maps_link}
            />
                
            <InfoItem
                icon={Globe}
                title={<Translate>Website</Translate>}
                content={orgProfile.org_website}
                link={orgProfile.org_website}
            />
            <InfoItem
                icon={FileText}
                title={<Translate>Registration Number</Translate>}
                content={orgProfile.org_registration_number}
            />
            <InfoItem
                icon={Calendar}
                title={<Translate>Established</Translate>}
                content={orgProfile.org_year_established}
            />
            </ul>

            {/* Contact Button */}
            <div className="mt-8">
            <a
                href={`mailto:${orgProfile.org_email}`}
                className="block w-full text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200 "
            >
                <Translate>Contact Us</Translate>
            </a>
            </div>
        </div>

        {/* Map Section */}
        {orgProfile.org_google_maps_link && (
            <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <Translate>Location</Translate>
            </h3>
            <div className="rounded-lg overflow-hidden ">
                <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    36.7779108 - 0.002
                },${-1.0586336 - 0.002},${36.7779108 + 0.002},${
                    -1.0586336 + 0.002
                }&layer=mapnik&marker=${-1.0586336},${36.7779108}`}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
                title="Location Map"
                />
                <div className="mt-2 text-right">
                <a
                    href={orgProfile.org_google_maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-m text-teal-600 hover:text-teal-700 font-medium"
                >
                    <Translate>View larger map</Translate>
                    <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                </div>
            </div>
            </div>
        )}

        {/* Social Media Section */}
        <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
            <Translate>Connect With Us</Translate>
            </h3>
            <div className="flex items-center gap-2">
            <SocialIcon
                icon={Facebook}
                href={orgProfile.org_facebook}
                label="Facebook"
            />
            <SocialIcon
                icon={Instagram}
                href={orgProfile.org_instagram}
                label="Instagram"
            />
            <SocialIcon
                icon={XIcon}
                href={orgProfile.org_x}
                label="X (Twitter)"
            />
            <SocialIcon
                icon={Linkedin}
                href={orgProfile.org_linkedin}
                label="LinkedIn"
            />
            <SocialIcon
                icon={Youtube}
                href={orgProfile.org_youtube}
                label="YouTube"
            />
            </div>
        </div>
        </div>
    );
}
