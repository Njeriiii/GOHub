import React, { useState } from 'react';
import { useApi } from '../contexts/ApiProvider';

/**
 * Self-contained modal component for donation QR code generation
 */
const QRDonation = ({ 
    merchantName, 
    trxCode, 
    cpi, 
    isOpen, 
    onClose 
}) => {
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const apiClient = useApi();

    const generateRefNo = () => {
        return 'DON' + Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const handleSubmit = async () => {
        // Validate amount
        if (!amount.trim()) {
            setErrors({ amount: 'Amount is required' });
            return;
        }
        if (!/^\d+$/.test(amount)) {
            setErrors({ amount: 'Amount must be a number' });
            return;
        }
        if (parseInt(amount) < 1) {
            setErrors({ amount: 'Amount must be greater than 0' });
            return;
        }

        setIsGenerating(true);

        try {
            const qrData = {
                MerchantName: merchantName,
                RefNo: generateRefNo(),
                Amount: parseInt(amount),
                TrxCode: trxCode,
                CPI: cpi,
                Size: "300"
            };
            console.log('qrData', qrData);

            // Call your API endpoint here
            // Using ApiClient instead of fetch
            const response = await apiClient.post('/profile/generate-qr', qrData);
            console.log('response', response);

            // wait for the response and set the QR code

            if (!response.ok) throw new Error('Failed to generate QR code');
            const data = await response.body;
            console.log('data', data);
            setQrCode(data.qr_code);

        } catch (error) {
            setErrors({ submit: 'Failed to generate QR code. Please try again.' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setAmount(value);
            if (errors.amount) {
                setErrors({});
            }
        }
    };

    const handleClose = () => {
        setAmount('');
        setErrors({});
        setQrCode(null);
        onClose();
    };

    if (!isOpen) return null;

    // Function to format base64 data as image source
    const getImageSource = (base64Data) => {
        // If the data already includes the data URL prefix, return as is
        if (base64Data?.startsWith('data:image')) {
        return base64Data;
        }
        // Otherwise, add the proper data URL prefix
        return `data:image/png;base64,${base64Data}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Make a Donation</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    {!qrCode ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (KES)
                                </label>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className={`w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${
                                        errors.amount ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter amount in KES"
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Donation Details:</h4>
                                <div className="text-sm text-gray-600">
                                    <p>To: {merchantName}</p>
                                    <p>Amount: {amount ? `${amount} KES` : '-'}</p>
                                    <p>Payment Method: {trxCode === 'PB' ? 'Paybill' : 'M-Pesa Number'}</p>
                                </div>
                            </div>

                            {errors.submit && (
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isGenerating}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                                >
                                    {isGenerating ? 'Generating...' : 'Generate QR Code'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                {qrCode ? (
                                <img
                                    src={getImageSource(qrCode)}
                                    alt="Payment QR Code"
                                    className="mx-auto"
                                    width="300"
                                    height="300"
                                />
                                ) : (
                                <div className="h-[300px] w-[300px] flex items-center justify-center bg-gray-200 mx-auto">
                                    <p className="text-gray-500">QR Code not available</p>
                                </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                Scan this QR code with your M-Pesa app to make the donation
                            </p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 w-full"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRDonation;