import React, { useState } from 'react';
import {
    Upload,
    Image as ImageIcon,
    Save,
    CheckCircle2,
} from "lucide-react";
import { useApi } from '../../contexts/ApiProvider';
import { useAuth } from '../../contexts/AuthProvider';

export function ProfileImages({ orgId, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImages, setSelectedImages] = useState({
        logo: null,
        cover_photo: null,
    });
    const [previews, setPreviews] = useState({
        logo: null,
        cover_photo: null,
    });

    const apiClient = useApi();
    const { user } = useAuth();

    const handleImageSelect = (type, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(file.type)) {
            setError(`Please select a JPG or PNG image for ${type}`);
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError(`${type} image size should be less than 5MB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
            reader.onloadend = () => {
            setPreviews((prev) => ({
                ...prev,
                [type]: reader.result,
            }));
        };
        reader.readAsDataURL(file);

        setSelectedImages((prev) => ({
            ...prev,
                [type]: file,
            }));
        
        console.log("selectedImages", selectedImages);
        setError(null);
    };

    const handleSubmit = async () => {
        // Skip if no images selected
        console.log("selectedImages at handleSubmit ", selectedImages);
        if (!selectedImages.logo && !selectedImages.cover_photo) {
            onComplete();
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("user_id", user.id);
            console.log("user", user);

            console.log('FormData1 has user id', formData.get("user_id"));

            if (selectedImages.logo) {
                formData.append("logo", selectedImages.logo);
            }
            console.log('FormData2', formData.get("logo"));
            if (selectedImages.cover_photo) {
                formData.append("cover_photo", selectedImages.cover_photo);
            }

            console.log("formData3", formData.get("cover_photo"));

            const response = apiClient.post('/profile/upload-images', formData);

            console.log("response", response);

            const data = await response.json();

            console.log("data", data);

            if (!response.ok) {
                throw new Error(data.error || "Failed to upload images");
            }

        // onComplete();
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
            {/* Enhanced Header with animation */}
            <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-flex flex-col items-center space-y-2 bg-white rounded-2xl px-8 py-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                <ImageIcon className="h-8 w-8 text-teal-600" />
                <h2 className="text-3xl font-bold text-gray-800">
                    Bring Your Profile to Life
                </h2>
                </div>
                <p className="text-gray-600 text-xl max-w-2xl">
                Add visual identity to your organization's profile with a logo and
                cover photo
                </p>
            </div>
            </div>

            {/* Main content with enhanced visuals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                {/* Logo Upload with enhanced UI */}
                <div className="space-y-4 group">
                    <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm group-hover:shadow transition-all">
                        <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                        Organization Logo
                        </h3>
                        <p className="text-gray-500">
                        Perfect square ratio (Minimum: 100x100px)
                        </p>
                    </div>
                    </div>

                    <div className="relative h-72 w-full transition-all">
                    {previews.logo ? (
                        <div className="relative w-full h-full group">
                        <img
                            src={previews.logo}
                            alt="Logo preview"
                            className="w-full h-full object-contain bg-gray-50 rounded-xl border-2 border-blue-100"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-xl" />
                        <label className="absolute bottom-4 right-4 bg-white rounded-xl px-4 py-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-all transform hover:-translate-y-1 border border-gray-200">
                            <span className="text-base font-medium">
                            Change Logo
                            </span>
                            <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleImageSelect("logo", e)}
                            disabled={loading}
                            />
                        </label>
                        <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group">
                        <div className="p-4 rounded-full bg-blue-50 mb-4 group-hover:bg-blue-100 transition-all">
                            <Upload className="h-10 w-10 text-blue-500 group-hover:text-blue-600 transition-all" />
                        </div>
                        <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                            Upload Logo
                        </span>
                        <span className="text-gray-500 mt-2 text-center max-w-[80%]">
                            Drag and drop or click to select
                            <br />
                            JPG or PNG, max 5MB
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleImageSelect("logo", e)}
                            disabled={loading}
                        />
                        </label>
                    )}
                    </div>
                </div>

                {/* Cover Photo Upload with enhanced UI */}
                <div className="space-y-4 group">
                    <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm group-hover:shadow transition-all">
                        <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                        Cover Photo
                        </h3>
                        <p className="text-gray-500">
                        2:1 ratio recommended (Minimum: 800x400px)
                        </p>
                    </div>
                    </div>

                    <div className="relative h-72 w-full transition-all">
                    {previews.cover_photo ? (
                        <div className="relative w-full h-full group">
                        <img
                            src={previews.cover_photo}
                            alt="Cover photo preview"
                            className="w-full h-full object-cover rounded-xl border-2 border-teal-100"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-xl" />
                        <label className="absolute bottom-4 right-4 bg-white rounded-xl px-4 py-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-all transform hover:-translate-y-1 border border-gray-200">
                            <span className="text-base font-medium">
                            Change Cover
                            </span>
                            <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleImageSelect("cover_photo", e)}
                            disabled={loading}
                            />
                        </label>
                        <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all duration-300 group">
                        <div className="p-4 rounded-full bg-teal-50 mb-4 group-hover:bg-teal-100 transition-all">
                            <Upload className="h-10 w-10 text-teal-500 group-hover:text-teal-600 transition-all" />
                        </div>
                        <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                            Upload Cover Photo
                        </span>
                        <span className="text-gray-500 mt-2 text-center max-w-[80%]">
                            Drag and drop or click to select
                            <br />
                            JPG or PNG, max 5MB
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleImageSelect("cover_photo", e)}
                            disabled={loading}
                        />
                        </label>
                    )}
                    </div>
                </div>
                </div>

                {/* Enhanced Error Message */}
                {error && (
                <div className="mt-8 bg-red-50 border border-red-100 rounded-xl p-6 text-red-600 animate-slideIn">
                    <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">⚠️</div>
                    <p className="text-base">{error}</p>
                    </div>
                </div>
                )}

                {/* Enhanced Navigation buttons */}
                <div className="flex justify-between items-center mt-12">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                    <span className="text-base font-medium">
                    {loading ? "Saving Changes..." : "Complete Profile"}
                    </span>
                    <Save className="h-5 w-5" />
                </button>
                </div>
            </div>
            </div>

            {/* Optional tip */}
            <div className="mt-6 text-center text-gray-500 text-m animate-fadeIn">
            Tip: Your organization's visual identity helps build trust and
            recognition
            </div>
        </div>        
        </div>
    );
    }

export default ProfileImages;