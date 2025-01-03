import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
// This component represents the initiatives section of the organization profile form.
// It includes fields for the initiative name and description.

// AutoResizeTextarea component
const AutoResizeTextarea = ({ value, onChange, placeholder, name }) => {
    const textareaRef = useRef(null);
    const mirrorRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const mirror = mirrorRef.current;

        if (textarea && mirror) {
            // Copy styles to mirror
            const styles = window.getComputedStyle(textarea);
            mirror.style.width = styles.width;
            mirror.style.padding = styles.padding;
            mirror.style.borderStyle = styles.borderStyle;
            mirror.style.borderWidth = styles.borderWidth;
            mirror.style.boxSizing = styles.boxSizing;
            mirror.style.fontFamily = styles.fontFamily;
            mirror.style.fontSize = styles.fontSize;
            
            // Set mirror content and adjust height
            mirror.textContent = value || placeholder;
            textarea.style.height = `${mirror.scrollHeight}px`;
        }
    }, [value, placeholder]);

    return (
        <div className="relative w-full">
            <textarea
                ref={textareaRef}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={1}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 resize-none overflow-hidden"
                style={{ 
                    minHeight: '100px',
                    height: 'auto',
                    overflow: 'hidden'
                }}
            />
            <div 
                ref={mirrorRef} 
                className="absolute left-[-9999px] top-0 whitespace-pre-wrap break-words"
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                    wordWrap: 'break-word'
                }}
            />
        </div>
    );
};

const ProgramInitiativesList = forwardRef(({ 
    initialInitiatives = [], 
    hideTitle = false,
    onInitiativesChange // New prop for data sync
}, ref) => {
    // Initialize with provided initiatives or default empty one
    const [initiatives, setInitiatives] = useState(() => {
        if (initialInitiatives.length > 0) {
            // Transform incoming data to match component format
            return initialInitiatives.map(initiative => ({
                initiativeName: initiative.initiative_name || "",
                description: initiative.initiative_description || "",
                id: initiative.id,
                org_id: initiative.org_id
            }));
        }
        return [{ initiativeName: "", description: "" }];
    });

    // Effect to handle data changes
    useEffect(() => {
        if (onInitiativesChange) {
            const transformedData = initiatives.map(initiative => ({
                id: initiative.id,
                initiative_name: initiative.initiativeName,
                initiative_description: initiative.description,
                org_id: initiative.org_id
            }));
            onInitiativesChange(transformedData);
        }
    }, [initiatives]);

    // Add a new initiative object to the array
    const handleAddInitiative = () => {
        setInitiatives([
        ...initiatives,
        { initiativeName: "", description: "" },
        ]);
    };

    // Update the initiative object at the given index
    const handleInputChange = (index, event) => {
        const values = [...initiatives];
        values[index] = {
            ...values[index],
            [event.target.name]: event.target.value
        };
        setInitiatives(values);
    };

    // Remove the initiative object at the given index
    const handleRemoveInitiative = (index) => {
        const values = [...initiatives];
        values.splice(index, 1); // Remove the element at the given index
        setInitiatives(values.length > 0 ? values : [{ initiativeName: "", description: "" }]);
    };

    // Transform data back to API format when getting data
    useImperativeHandle(ref, () => ({
        getData: () => initiatives.map(initiative => ({
            id: initiative.id,
            initiative_name: initiative.initiativeName,
            initiative_description: initiative.description,
            org_id: initiative.org_id
        }))
    }));

    return (
        <div className="flex flex-col justify-center">
            <div id="initiatives-container" className="mt-4 text-xl font-medium text-gray-700">
                {!hideTitle && (
                    <>
                        <h2 className="text-3xl font-semibold mb-5 text-gray-900">
                            Programs & Initiatives
                        </h2>
                    </>
                )}
                <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
                    <p className="text-m text-teal-700">
                        Describe your organization's strategic, ongoing efforts that define its core mission. 
                        Focus on broad, continuous initiatives that go beyond specific time-bound projects. 
                        These are the foundational programs that showcase your organization's approach to creating lasting social impact.
                    </p>
                </div>

                {initiatives.map((initiative, index) => (
                    <div key={initiative.id || index} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="mb-4">
                            <label 
                                htmlFor={`initiativeName-${index}`} 
                                className="block text-m font-medium text-gray-700 mb-2"
                            >
                                Initiative Name
                            </label>
                            <input
                                type="text"
                                id={`initiativeName-${index}`}
                                name="initiativeName"
                                value={initiative.initiativeName}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="E.g., Youth Empowerment Program"
                                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                            />
                        </div>

                        <div>
                            <label 
                                htmlFor={`description-${index}`} 
                                className="block text-m font-medium text-gray-700 mb-2"
                            >
                                Description
                            </label>
                            <AutoResizeTextarea
                                name="description"
                                value={initiative.description}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Provide a brief overview of the initiative, its goals, target audience, and potential impact."
                            />
                        </div>

                        {initiatives.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => handleRemoveInitiative(index)} 
                                className="mt-4 text-sm rounded-md font-semibold px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200"
                            >
                                Remove Initiative
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end mb-20">
                <button 
                    type="button" 
                    onClick={handleAddInitiative} 
                    className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                    + Add Another Initiative
                </button>
            </div>

            <hr className="border-gray-200" />
        </div>
    );
});

export default ProgramInitiativesList;
