import React, { useState, forwardRef, useImperativeHandle } from 'react';

const OrgAddress = forwardRef((props, ref) => {
    const [districtTown, setDistrictTown] = useState('');
    const [county, setCounty] = useState('');
    const [poBox, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
        case 'districtTown':
            setDistrictTown(value);
            break;

        case 'county':
            setCounty(value);
            break;

        case 'poBox':
            setZipCode(value);
            break;

        case 'country':
            setCountry(value);
            break;
        default:
            // Do nothing
        }
    };

    const getData = () => {
        return { districtTown, county, poBox, country };
    };

    useImperativeHandle(ref, () => ({ getData }));

return (
    <div className="container p-6"> 
        <h2 className="text-2xl font-semibold mb-4">Address</h2>

        <div className="grid grid-cols-1 gap-6 mb-4"> 
            <div className="w-1/2"> 
                <label htmlFor="districtTownInput" className="block text-xl font-medium text-gray-700">
                    District / Town
                </label>
                <input 
                    type="text" 
                    id="districtTownInput" 
                    name="districtTown" 
                    value={districtTown} 
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="countyInput" className="block text-xl font-medium leading-6 text-gray-900">
                County:
                </label>
                <div class="mt-2 w-1/2">
                    <input 
                    type="text" 
                    id="countyInput" 
                    name="county" 
                    value={county} 
                    onChange={handleInputChange} 
                    className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                </div>
            </div>

            <div className="sm:col-span-2">
                <label htmlFor="poBoxInput" className="block text-xl font-medium text-gray-700">
                    PO Box:
                </label>
                <div class="mt-2 w-1/2">
                    <input 
                    type="text" 
                    id="poBoxInput"  
                    name="poBox" 
                    value={poBox} 
                    onChange={handleInputChange} 
                    className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="sm:col-span-2">
                <label htmlFor="countryInput" className="block text-xl font-medium text-gray-700">
                    Country:
                </label>
                <div class="mt-2 w-1/2">
                    <input 
                    type="text" 
                    id="countryInput" 
                    name="country" 
                    value={country} 
                    onChange={handleInputChange} 
                    className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
        </div> 
    </div>
    );
});
export default OrgAddress;
