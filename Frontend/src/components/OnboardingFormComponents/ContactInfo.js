import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

const ContactInfo = forwardRef(({ initialValues = { email: '', phone: '' } }, ref) => {
    const [state, setState] = useState(initialValues);

    const [errors, setErrors] = useState({
        email: '',
        phone: ''
    });

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        // Kenyan phone number format: +254 or 0 followed by 9 digits
        const re = /^(?:\+254|0)[17]\d{8}$/;
        return re.test(phone);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        // Clear errors when user types
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        // Email validation
        if (!state.email) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(state.email)) {
            tempErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Phone validation
        if (!state.phone) {
            tempErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!validatePhone(state.phone)) {
            tempErrors.phone = 'Please enter a valid Kenyan phone number (+254 or 0 followed by 9 digits)';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const getData = () => {
        if (validate()) {
            return { ...state };
        }
        return null;
    };

    useImperativeHandle(ref, () => ({ getData }), [state]);

    return (
        <div className="mt-6 mx-auto p-6">
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-4">
                {/* Email Input */}
                <div className="w-full">
                    <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                        Email Address
                    </label>
                    <div className="mt-1">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={state.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                            placeholder="organization@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Phone Input */}
                <div className="w-full">
                    <label htmlFor="phone" className="block text-xl font-medium text-gray-700">
                        Phone Number
                    </label>
                    <div className="mt-1">
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={state.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"
                            placeholder="+254... or 0..."
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter a valid Kenyan phone number (starting with +254 or 0)
                    </p>
                </div>
            </div>
        </div>
    );
});

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo;
