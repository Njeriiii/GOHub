import React, { useState, forwardRef, useImperativeHandle } from 'react';
// This component represents the social media links section of the organization onboarding form.
// It includes fields for the organization's website, Facebook, Twitter, Instagram, LinkedIn, and YouTube links.
const SocialMediaLinks = forwardRef((props, ref) => {
    const [links, setLinks] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLinks(prevLinks => ({
            ...prevLinks,
            [name]: value
        }));
    };

    const getData = () => {
        return links;
    };

    useImperativeHandle(ref, () => ({ getData }), [links]);

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                    <label htmlFor="websiteInput" className="block text-sm font-medium text-gray-700">
                        Website
                    </label>
                    <input
                        type="url"
                        id="websiteInput"
                        name="website"
                        value={links.website}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm"
                        placeholder="https://website.com/yourpage"
                    />
                </div>
                <div>
                    <label htmlFor="facebookInput" className="block text-sm font-medium text-gray-700">
                        Facebook
                    </label>
                    <input
                        type="url"
                        id="facebookInput"
                        name="facebook"
                        value={links.facebook}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm"
                        placeholder="https://facebook.com/yourpage"
                    />
                </div>
                <div>
                    <label htmlFor="twitterInput" className="block text-sm font-medium text-gray-700">
                        Twitter
                    </label>
                    <input
                        type="url"
                        id="twitterInput"
                        name="twitter"
                        value={links.twitter}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm"
                        placeholder="https://twitter.com/yourhandle"
                    />
                </div>
                <div>
                    <label htmlFor="instagramInput" className="block text-sm font-medium text-gray-700">
                        Instagram
                    </label>
                    <input
                        type="url"
                        id="instagramInput"
                        name="instagram"
                        value={links.instagram}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm"
                        placeholder="https://instagram.com/yourprofile"
                    />
                </div>
                <div>
                    <label htmlFor="linkedinInput" className="block text-sm font-medium text-gray-700">
                        LinkedIn
                    </label>
                    <input
                        type="url"
                        id="linkedinInput"
                        name="linkedin"
                        value={links.linkedin}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm"
                        placeholder="https://linkedin.com/company/yourcompany"
                    />
                </div>
                <div>
                    <label htmlFor="youtubeInput" className="block text-sm font-medium text-gray-700">
                        YouTube
                    </label>
                    <input
                        type="url"
                        id="youtubeInput"
                        name="youtube"
                        value={links.youtube}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm"
                        placeholder="https://youtube.com/yourchannel"
                    />
                </div>
            </div>
        </div>
    );
});

export default SocialMediaLinks;