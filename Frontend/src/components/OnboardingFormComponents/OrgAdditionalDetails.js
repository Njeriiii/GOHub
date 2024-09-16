import React, { useState, forwardRef, useImperativeHandle } from 'react';
import CreatableSelect from 'react-select/creatable';

const OrgAdditionalDetails = forwardRef((props, ref) => {
    const [state, setState] = useState({
        org_registration_number: '',
        org_year_established: '',
        focus_areas: []
    });

    const focusAreaOptions = [
        { value: 'Education', label: 'Education' },
        { value: 'Health', label: 'Health' },
        { value: 'Environment', label: 'Environment' },
        { value: 'Human Rights', label: 'Human Rights' },
        { value: 'Poverty Alleviation', label: 'Poverty Alleviation' },
        { value: 'Gender Equality', label: 'Gender Equality' },
        { value: 'Children & Youth', label: 'Children & Youth' },
        { value: 'Disaster Relief', label: 'Disaster Relief' },
        { value: 'Community Development', label: 'Community Development' },
        { value: 'Arts & Culture', label: 'Arts & Culture' }
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleFocusAreaChange = (newValue) => {
        setState(prevState => ({
        ...prevState,
        focus_areas: newValue
        }));
    };

    useImperativeHandle(ref, () => ({
        getData: () => ({
        ...state,
        focus_areas: state.focus_areas.map(area => area.value)
        })
    }));

    return (
        <div className="space-y-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Additional Organization Details</h3>
        
        <div>
            <label htmlFor="org_registration_number" className="block text-sm font-medium text-gray-700">
            Registration Number
            </label>
            <input
            type="text"
            name="org_registration_number"
            id="org_registration_number"
            value={state.org_registration_number}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            />
        </div>

        <div>
            <label htmlFor="org_year_established" className="block text-sm font-medium text-gray-700">
            Year Established
            </label>
            <input
            type="number"
            name="org_year_established"
            id="org_year_established"
            value={state.org_year_established}
            onChange={handleInputChange}
            min="1800"
            max={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Focus Areas</label>
            <CreatableSelect
            isMulti
            options={focusAreaOptions}
            value={state.focus_areas}
            onChange={handleFocusAreaChange}
            className="mt-1"
            classNamePrefix="select"
            placeholder="Select or create focus areas..."
            />
        </div>
        </div>
    );
});

export default OrgAdditionalDetails;