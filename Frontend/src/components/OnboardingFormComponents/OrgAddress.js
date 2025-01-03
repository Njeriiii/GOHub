import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import Select from 'react-select';
import { MapPin } from 'lucide-react';
// This component represents the address section of the organization onboarding form.

const OrgAddress = forwardRef(({ initialValues = {
        districtTown: '',
        county: null,
        poBox: '',
        country: { value: 'Kenya', label: 'Kenya' },
        physicalDescription: '',
        googleMapsLink: ''
} }, ref) => {
    const [state, setState] = useState({
        districtTown: initialValues.districtTown || '',
        county: initialValues.county ? { value: initialValues.county, label: initialValues.county } : null,
        poBox: initialValues.poBox || '',
        country: { value: 'Kenya', label: 'Kenya' },
        physicalDescription: initialValues.physicalDescription || '',
        googleMapsLink: initialValues.googleMapsLink || ''
    });
    // Update state when initialValues change
    useEffect(() => {
        setState({
            districtTown: initialValues.districtTown || '',
            county: initialValues.county ? { value: initialValues.county, label: initialValues.county } : null,
            poBox: initialValues.poBox || '',
            country: { value: 'Kenya', label: 'Kenya' },
            physicalDescription: initialValues.physicalDescription || '',
            googleMapsLink: initialValues.googleMapsLink || ''
        });
    }, [initialValues]);
    
    const [errors, setErrors] = useState({
        districtTown: '',
        county: '',
        poBox: '',
        physicalDescription: '',
        googleMapsLink: ''
    });

    const descriptionRef = useRef(null);

    const adjustTextAreaHeight = () => {
        const textArea = descriptionRef.current;
        if (textArea) {
            textArea.style.height = 'auto';
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextAreaHeight();
    }, [state.physicalDescription]);

    useEffect(() => {
        window.addEventListener('resize', adjustTextAreaHeight);
        return () => window.removeEventListener('resize', adjustTextAreaHeight);
    }, []);

    const kenyanCounties = [
        'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa', 
        'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 
        'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 
        'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 
        'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 
        'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 
        'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
    ].sort().map(county => ({ value: county, label: county }));

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleCountyChange = (selectedOption) => {
        setState(prevState => ({
            ...prevState,
            county: selectedOption
        }));
        setErrors(prev => ({
            ...prev,
            county: ''
        }));
    };

    const validateGoogleMapsLink = (link) => {
        return link === '' || link.includes('goo.gl/maps') || link.includes('google.com/maps') || link.includes('maps.app.goo.gl');
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!state.districtTown.trim()) {
            tempErrors.districtTown = 'District/Town is required';
            isValid = false;
        }

        if (!state.county) {
            tempErrors.county = 'County is required';
            isValid = false;
        }

        if (!state.poBox.trim()) {
            tempErrors.poBox = 'P.O. Box is required';
            isValid = false;
        }

        if (!state.physicalDescription.trim()) {
            tempErrors.physicalDescription = 'Physical description is required';
            isValid = false;
        }

        if (state.googleMapsLink && !validateGoogleMapsLink(state.googleMapsLink)) {
            tempErrors.googleMapsLink = 'Please enter a valid Google Maps link';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const getData = () => {
        if (validate()) {
            return {
                districtTown: state.districtTown,
                county: state.county?.value || '',
                poBox: state.poBox,
                country: state.country.value,
                physicalDescription: state.physicalDescription,
                googleMapsLink: state.googleMapsLink
            };
        }
        return null;
    };

    useImperativeHandle(ref, () => ({ getData }));

return (
    <div className="space-y-6 p-6"> 
        <h2 className="text-xl font-medium text-gray-900">Address</h2>

        <div className="grid grid-cols-1 gap-6"> 
            {/* District/Town Input */}
            <div>
                <label htmlFor="districtTown" className="block text-xl font-medium text-gray-700">
                    District / Town
                </label>
                <input 
                    type="text" 
                    id="districtTown" 
                    name="districtTown" 
                    value={state.districtTown} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                    placeholder="e.g., Westlands"
                />
                {errors.districtTown && (
                    <p className="mt-1 text-sm text-red-600">{errors.districtTown}</p>
                )}
            </div>

            {/* County Select */}
            <div>
                <label htmlFor="county" className="block text-xl font-medium text-gray-700">
                    County
                </label>
                <Select
                    id="county"
                    value={state.county}
                    onChange={handleCountyChange}
                    options={kenyanCounties}
                    className="mt-1"
                    classNamePrefix="select"
                    placeholder="Select a county..."
                />
                {errors.county && (
                    <p className="mt-1 text-sm text-red-600">{errors.county}</p>
                )}
            </div>

            {/* P.O. Box Input */}
            <div>
                <label htmlFor="poBox" className="block text-xl font-medium text-gray-700">
                    P.O. Box
                </label>
                <input 
                    type="text" 
                    id="poBox"  
                    name="poBox" 
                    value={state.poBox} 
                    onChange={handleInputChange} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                    placeholder="e.g., P.O. Box 12345-00100"
                />
                {errors.poBox && (
                    <p className="mt-1 text-sm text-red-600">{errors.poBox}</p>
                )}
            </div>

            {/* Country (Disabled, always Kenya) */}
            <div>
                <label htmlFor="country" className="block text-xl font-medium text-gray-700">
                    Country
                </label>
                <Select
                    id="country"
                    value={state.country}
                    isDisabled={true}
                    options={[{ value: 'Kenya', label: 'Kenya' }]}
                    className="mt-1"
                    classNamePrefix="select"
                />
            </div>

            {/* Physical Description */}
            <div>
                <label htmlFor="physicalDescription" className="block text-xl font-medium text-gray-700">
                    Physical Location Description
                </label>
                <p className="mt-1 text-sm text-gray-500">
                    Provide landmarks and directions to help people find your location
                </p>
                <textarea
                    ref={descriptionRef}
                    id="physicalDescription"
                    name="physicalDescription"
                    value={state.physicalDescription}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base min-h-[100px]"
                    placeholder="e.g., Located on the 3rd floor of Kilimani Business Center, next to Shell Petrol Station"
                    style={{ resize: 'none', overflow: 'hidden' }}
                />
                {errors.physicalDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.physicalDescription}</p>
                )}
            </div>

            {/* Google Maps Link */}
            <div>
                <label htmlFor="googleMapsLink" className="block text-xl font-medium text-gray-700">
                    Google Maps Location
                </label>
                <p className="mt-1 text-sm text-gray-500">
                    Share your Google Maps link to help people find your exact location
                </p>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="url" 
                        id="googleMapsLink"  
                        name="googleMapsLink" 
                        value={state.googleMapsLink} 
                        onChange={handleInputChange} 
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                        placeholder="https://goo.gl/maps/..."
                    />
                </div>
                {errors.googleMapsLink && (
                    <p className="mt-1 text-sm text-red-600">{errors.googleMapsLink}</p>
                )}
            </div>
        </div> 
    </div>
);
});
export default OrgAddress;
