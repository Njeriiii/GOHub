import React from "react";
import { useNavigate } from 'react-router-dom';

// Component to load all organisations and display their name and an overview

export default function OrgDisplayCard( {org} ) {

    const navigate = useNavigate();

    function handleProfileLinkClick(org) { // Accept the org object
        // No need for event.preventDefault() since we're not using a link
        console.log('Navigating to org profile page');
    
    // navigate directly and pass the org object for usage in the profile page.
    navigate('/org_profile', { state: { org } }); 
    }

return (
    <div className=''>
        <div class="lg:grid-cols-2">

            <div key={org.org_id} onClick={() => handleProfileLinkClick(org)} class="hover:bg-sky-50 relative m-20 flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-full max-w-[48rem] flex-row">
                
                <div
                    class="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0">
                    <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1471&amp;q=80"
                    alt="card-image" class="object-cover w-full h-full" />
                </div>

                <div class="p-6">
                    <h6 class="block mb-4 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-700 uppercase">
                    Organisations
                    </h6>

                    <h4 class="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    {org.org_name}
                    </h4>

                    <p class="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                    {org.org_overview}
                    </p>

                    <button
                    class="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
                    type="button" onClick={() => handleProfileLinkClick(org)}>

                        Go to Profile
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
                        </svg>
                    </button>
                </div>

            </div>  

        </div>
    </div>
);
}