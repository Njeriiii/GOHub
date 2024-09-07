import React from 'react';

export default function Sidebar ({ onboardingFormData }) {

return (    
    <div class="p-6 w-1/4">
        <ul className="">
            <li className="mb-4 text-xs">
                <h3 className="text-xs font-bold text-gray-800 mb-2">Email:</h3>
                <a
                    href={`mailto:${onboardingFormData.orgProfile.org_email}`}
                    className="block text-gray-500 hover:text-gray-700"
                >
                    {onboardingFormData.orgProfile.org_email}
                </a>
            </li>
            <li className="mb-4 text-xs">
                <h3 className="text-xs font-bold text-gray-800 mb-2">Phone:</h3>
                <a
                    href={`tel:${onboardingFormData.orgProfile.org_phone}`}
                    className="block text-gray-500 hover:text-gray-700"
                >
                    {onboardingFormData.orgProfile.org_phone}
                </a>
            </li>
            <li>
                <h3 className="text-xs font-bold text-gray-800 mb-2">Address:</h3>
                <p className="text-gray-500 text-xs">
                    {onboardingFormData.orgProfile.org_district_town},{' '}
                    {onboardingFormData.orgProfile.org_county}
                    <br />
                    PO Box: {onboardingFormData.orgProfile.org_po_box}
                </p>
            </li>
        </ul>

        <div className="p-4 pl-1">
            <a href={`mailto:${onboardingFormData.orgProfile.org_email}`}>
                <button className="px-8 py-2 text-white bg-purple-900 rounded hover:bg-purple-800 text-xs" href={`mailto:${onboardingFormData.orgProfile.org_email}`}>
                    Contact Us
                </button>
            </a>
        </div>
    </div>
    );
};