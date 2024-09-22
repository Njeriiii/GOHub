import React, { useState, forwardRef, useImperativeHandle } from 'react';
// This component represents the organization logo section of the organization onboarding form.
// Not fully functional yet
const OrgLogo = forwardRef((props, ref) => {
    const [logoFile, setLogoFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(''); // To display a preview

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setLogoFile(file);

        // Create a preview URL for the uploaded image
        const reader = new FileReader();
        reader.onloadend = () => {
        setPreviewSrc(reader.result);
        };
        if (file) {
        reader.readAsDataURL(file);
        } else {
        setPreviewSrc(''); // Clear preview on removing a file
        }
    };

    const getData = () => {
        return logoFile; // Return the actual file object
    };

    useImperativeHandle(ref, () => ({ getData }));

    return (
        <div className="col-span-full p-6">
            <label htmlFor="logoUpload" className="block text-lg font-medium leading-6 text-gray-900">
                Org Logo:
            </label>
            <div className="mt-2 flex items-center gap-x-3">
                <input type="file" id="logoUpload" accept="image/*" onChange={handleFileChange} />
                {previewSrc && <img src={previewSrc} alt="Logo Preview" />} {/* Display the preview */}
            </div>
        </div>
    );
});

export default OrgLogo;
