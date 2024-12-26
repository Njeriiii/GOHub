import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Globe, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

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

const SocialMediaLinks = forwardRef((props, ref) => {
    const [links, setLinks] = useState({
        website: '',
        facebook: '',
        x: '',  // Changed from twitter to x
        instagram: '',
        linkedin: '',
        youtube: ''
    });

    const [errors, setErrors] = useState({
        website: '',
        facebook: '',
        x: '',
        instagram: '',
        linkedin: '',
        youtube: ''
    });

    // URL validation patterns
    const urlPatterns = {
        website: /^(https?:\/\/|www\.)[^\/\s]+\.[^\/\s]+$/, 
        facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
        x: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/,  // Include both x.com and twitter.com
        instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
        linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(company|in)\/.+/,
        youtube: /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)?.+/
    };

    const socialIcons = {
        website: Globe,
        facebook: Facebook,
        x: XIcon,
        instagram: Instagram,
        linkedin: Linkedin,
        youtube: Youtube
    };

    const platformLabels = {
        website: 'Website',
        facebook: 'Facebook',
        x: 'X (Twitter)',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        youtube: 'YouTube'
    };

    const placeholders = {
        website: 'https://www.example.org',
        facebook: 'https://facebook.com/yourpage',
        x: 'https://x.com/yourhandle',
        instagram: 'https://instagram.com/yourprofile',
        linkedin: 'https://linkedin.com/company/yourcompany',
        youtube: 'https://youtube.com/c/yourchannel'
    };

    const validateUrl = (type, url) => {
        if (!url) return true; // Empty URLs are valid
        console.log('url:', url);
        console.log('urlPatterns[type]:', urlPatterns[type]);
        console.log(urlPatterns[type].test(url))
        return urlPatterns[type].test(url);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLinks(prevLinks => ({
            ...prevLinks,
            [name]: value
        }));

        // Clear error when user starts typing
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));

        // Validate URL as user types
        if (value && !validateUrl(name, value)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: `Please enter a valid ${platformLabels[name]} URL`
            }));
        }
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        // Validate each non-empty URL
        Object.keys(links).forEach(platform => {
            if (links[platform] && !validateUrl(platform, links[platform])) {
                tempErrors[platform] = `Please enter a valid ${platformLabels[platform]} URL`;
                isValid = false;
            }
        });

        setErrors(tempErrors);
        return isValid;
    };

    const getData = () => {
        if (validate()) {
            return links;
        }
        return null;
    };

    useImperativeHandle(ref, () => ({ getData }), [links]);

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-xl font-medium text-gray-900">Social Media Links</h2>
            <p className="text-sm text-gray-500">Add your organization's social media links (optional)</p>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {Object.keys(links).map(platform => {
                    const Icon = socialIcons[platform];
                    return (
                        <div key={platform}>
                            <label htmlFor={`${platform}Input`} className="block text-xl font-medium text-gray-700">
                                {platformLabels[platform]}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Icon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    id={`${platform}Input`}
                                    name={platform}
                                    value={links[platform]}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                                    placeholder={placeholders[platform]}
                                />
                            </div>
                            {errors[platform] && (
                                <p className="mt-1 text-sm text-red-600">{errors[platform]}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default SocialMediaLinks;