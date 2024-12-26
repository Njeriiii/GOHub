import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import Select from 'react-select';
// This component represents the organization details section of the organization onboarding form.
// It includes fields for the organization name and a brief overview of the organization.
const OrgDetails = forwardRef((props, ref) => {
    const [state, setState] = useState({
        orgName: '',
        aboutOrg: '',
        orgRegistrationNumber: '',
        orgYearEstablished: '',
        focusAreas: []
    });

    const [errors, setErrors] = useState({
        orgName: '',
        aboutOrg: '',
        orgYearEstablished: '',
        focusAreas: ''
    });

    const textAreaRef = useRef(null);

    const adjustTextAreaHeight = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            // Reset height to auto to get the correct scrollHeight
            textArea.style.height = 'auto';
            // Set new height based on scrollHeight
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };

    // Adjust height on content change
    useEffect(() => {
        adjustTextAreaHeight();
    }, [state.aboutOrg]);

    // Adjust height on window resize
    useEffect(() => {
        window.addEventListener('resize', adjustTextAreaHeight);
        return () => window.removeEventListener('resize', adjustTextAreaHeight);
    }, []);

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
        
        // If it's the aboutOrg field, enforce character limit
        if (name === 'aboutOrg') {
            if (value.length <= 200) {
                setState(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        } else {
            setState(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleFocusAreaChange = (newValue) => {
        setState(prevState => ({
            ...prevState,
            focusAreas: newValue
        }));
        setErrors(prev => ({
            ...prev,
            focusAreas: ''
        }));
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!state.orgName.trim()) {
            tempErrors.orgName = 'Organization name is required';
            isValid = false;
        }

        if (!state.aboutOrg.trim()) {
            tempErrors.aboutOrg = 'Brief overview is required';
            isValid = false;
        } else if (state.aboutOrg.trim().length > 200) {
            tempErrors.aboutOrg = 'Overview should not exceed 200 characters';
            isValid = false;
        }

        if (state.orgYearEstablished) {
            const year = parseInt(state.orgYearEstablished);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1963 || year > currentYear) {
                tempErrors.orgYearEstablished = `Year must be between 1963 and ${currentYear}`;
                isValid = false;
            }
        }

        if (!state.focusAreas || state.focusAreas.length === 0) {
            tempErrors.focusAreas = 'Please select at least one focus area';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    useImperativeHandle(ref, () => ({
        getData: () => {
            if (validate()) {
                return {
                    ...state,
                    focusAreas: state.focusAreas.map(area => area.value)
                };
            }
            return null;
        }
    }), [state]);

    return (
        <div className="space-y-6">
            {/* Organization Name */}
            <div>
                <label htmlFor="orgName" className="block text-xl font-medium text-gray-700">
                    Organization Name
                </label>
                <input
                    type="text"
                    name="orgName"
                    id="orgName"
                    value={state.orgName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                    placeholder="e.g., GROOTS Kenya"
                />
                {errors.orgName && (
                    <p className="mt-1 text-sm text-red-600">{errors.orgName}</p>
                )}
            </div>

            {/* Overview */}
            <div>
                <label htmlFor="aboutOrg" className="block text-xl font-medium text-gray-700">
                    Overview
                </label>
                <div className="mt-1 relative">
                    <textarea
                        ref={textAreaRef}
                        name="aboutOrg"
                        id="aboutOrg"
                        value={state.aboutOrg}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base min-h-[100px] transition-height duration-200"
                        placeholder="Provide a brief description of your organization"
                        maxLength={200}
                        style={{ resize: 'none', overflow: 'hidden' }}
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                        {state.aboutOrg.length}/200
                    </div>
                </div>
                {errors.aboutOrg && (
                    <p className="mt-1 text-sm text-red-600">{errors.aboutOrg}</p>
                )}
            </div>

            {/* Registration Number */}
            <div>
                <label htmlFor="orgRegistrationNumber" className="block text-xl font-medium text-gray-700">
                    Registration Number
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="orgRegistrationNumber"
                        id="orgRegistrationNumber"
                        value={state.orgRegistrationNumber}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                        placeholder="Optional - Enter if registered"
                    />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    If your organization is registered, please provide the registration number
                </p>
            </div>

            {/* Year Established */}
            <div>
                <label htmlFor="orgYearEstablished" className="block text-xl font-medium text-gray-700">
                    Year Established
                </label>
                <input
                    type="number"
                    name="orgYearEstablished"
                    id="orgYearEstablished"
                    value={state.orgYearEstablished}
                    onChange={handleInputChange}
                    min="1963"
                    max={new Date().getFullYear()}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                    placeholder={`Year between 1963 and ${new Date().getFullYear()}`}
                />
                {errors.orgYearEstablished && (
                    <p className="mt-1 text-sm text-red-600">{errors.orgYearEstablished}</p>
                )}
            </div>

            {/* Focus Areas */}
            <div>
                <label className="block text-xl font-medium text-gray-700 focus:border-teal-500 focus:ring-teal-500">Focus Areas</label>
                <Select
                    isMulti
                    options={focusAreaOptions}
                    value={state.focusAreas}
                    onChange={handleFocusAreaChange}
                    className="mt-1"
                    classNamePrefix="select"
                    placeholder="Select focus areas..."
                />
                {errors.focusAreas && (
                    <p className="mt-1 text-sm text-red-600">{errors.focusAreas}</p>
                )}
            </div>
        </div>
    );
});

export default OrgDetails;
