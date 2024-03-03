import React, { useState, forwardRef, useImperativeHandle } from 'react';

const ContactInfo = forwardRef((props, ref) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const getData = () => {
        return { email, phone };
    };

    useImperativeHandle(ref, () => ({ getData }));

return (
    <div className="mt-6 mx-auto p-6"> {/* Spacing */}
        <h2 className="text-2xl font-semibold  font-medium text-gray-900">Contact Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 justify-center"> {/* Responsive grid */}
            <div className="w-3/4">
                <label htmlFor="emailInput" className="block text-xl font-medium text-gray-700">
                Email:
                </label>
                <input 
                type="email" 
                id="emailInput" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xl"
                />
            </div>
            <div className="w-3/4">
                <label htmlFor="phoneInput" className="block text-xl font-medium text-gray-700 ">
                Phone:
                </label>
                <input 
                type="tel" 
                id="phoneInput" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
        </div>
    </div>
    );
});

export default ContactInfo;
