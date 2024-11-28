import React, { forwardRef, useImperativeHandle, useState } from 'react';

// Payment types matching M-Pesa API transaction codes
const PaymentType = {
    PAYBILL: 'PB',     // For business paybill numbers
    SEND_MONEY: 'SM'   // For personal M-Pesa numbers
};

/**
 * M-Pesa configuration form for collecting donation payment details
 * Maps to MpesaConfig database model and M-Pesa API parameters
 */
const DonationData = forwardRef((props, ref) => {
    // Controls visibility of the entire form
    const [hasDonationLink, setHasDonationLink] = useState(false);
    
    // Main form state matching backend schema
    const [formData, setFormData] = useState({
        merchant_name: '',    // Business/Organization name
        payment_type: '',     // PB or SM
        identifier: ''        // Paybill number or phone number
    });

    const [errors, setErrors] = useState({});

    // Basic form validation
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.merchant_name.trim()) {
            newErrors.merchant_name = 'Merchant name is required';
        }
        
        if (!formData.payment_type) {
            newErrors.payment_type = 'Payment type is required';
        }
        
        if (!formData.identifier.trim()) {
            newErrors.identifier = 'Number is required';
        } else if (!/^\d+$/.test(formData.identifier)) {
            newErrors.identifier = 'Must contain only numbers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Generic handler for text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handler for payment type radio selection
    const handlePaymentTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            payment_type: value,
            identifier: ''  // Clear identifier when payment type changes
        }));
    };

    // Method exposed to parent component via ref to collect form data
    const getData = () => {
        if (!hasDonationLink) return null;
        if (validateForm()) {
            return formData;
        }
        return null;
    };

    useImperativeHandle(ref, () => ({ getData }));

    return (
        <div className="space-y-6">
            {/* Initial checkbox to show/hide the form */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="hasDonationLink"
                    checked={hasDonationLink}
                    onChange={(e) => setHasDonationLink(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="hasDonationLink" className="text-sm font-medium text-gray-700">
                    Would you like to receive donations via M-Pesa?
                </label>
            </div>

            {/* Main form - only shown if hasDonationLink is true */}
            {hasDonationLink && (
                <div className="space-y-6 mt-4">
                    {/* Business/Organization Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Business/Organization Name
                        </label>
                        <input
                            type="text"
                            name="merchant_name"
                            value={formData.merchant_name}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 ${
                                errors.merchant_name ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter your business name"
                        />
                        {errors.merchant_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.merchant_name}</p>
                        )}
                    </div>

                    {/* Payment Type Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="paybill"
                                    name="payment_type"
                                    value={PaymentType.PAYBILL}
                                    checked={formData.payment_type === PaymentType.PAYBILL}
                                    onChange={(e) => handlePaymentTypeChange(e.target.value)}
                                    className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                                <label htmlFor="paybill" className="text-sm text-gray-700">
                                    Paybill Number
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="sendmoney"
                                    name="payment_type"
                                    value={PaymentType.SEND_MONEY}
                                    checked={formData.payment_type === PaymentType.SEND_MONEY}
                                    onChange={(e) => handlePaymentTypeChange(e.target.value)}
                                    className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                                <label htmlFor="sendmoney" className="text-sm text-gray-700">
                                    M-Pesa Number
                                </label>
                            </div>
                        </div>
                        {errors.payment_type && (
                            <p className="mt-1 text-sm text-red-600">{errors.payment_type}</p>
                        )}
                    </div>

                    {/* Identifier Field - only shown after payment type is selected */}
                    {formData.payment_type && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {formData.payment_type === PaymentType.PAYBILL ? 'Paybill Number' : 'M-Pesa Number'}
                            </label>
                            <input
                                type="text"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 ${
                                    errors.identifier ? 'border-red-500' : ''
                                }`}
                                placeholder={formData.payment_type === PaymentType.PAYBILL 
                                    ? 'Enter paybill number' 
                                    : 'Enter phone number (254...)'}
                            />
                            {errors.identifier && (
                                <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

DonationData.displayName = 'DonationData';

export default DonationData;