import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
// This component represents the previous projects section of the organization onboarding form.
// It includes fields for the project name and a brief description of the project.
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
                className="w-full rounded-md border border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 resize-none overflow-hidden"
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

const PreviousProjectsList = forwardRef((props, ref) => {
    const [projects, setProjects] = useState([
        { projectName: "", description: "" }, // Add initial project
    ]);

    // Add a new project object to the array
    const handleAddProject = () => {
        setProjects([
        ...projects,
        { projectName: "", description: "" },
        ]);
    };

    // Update the project object at the given index
    const handleInputChange = (index, event) => {
        const values = [...projects];
        values[index][event.target.name] = event.target.value;
        setProjects(values);
    };

    // Remove the project object at the given index
    const handleRemoveProject = (index) => {
        const values = [...projects];
        values.splice(index, 1); // Remove the element at the given index
        setProjects(values.length > 0 ? values : [{ projectName: "", description: "" }]);
    };

    // Expose the getProjectsData function to parent components
    useImperativeHandle(ref, () => ({
        getData: () => projects, // Return the array of projects
    }));

    return (
        <div className="flex flex-col justify-center">
            <div id="projects-container" className="mt-4 text-xl font-medium text-gray-700">
                <h2 className="text-3xl font-semibold mb-5 text-gray-900">
                    Previous Projects
                </h2>

                <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
                    <p className="m text-teal-700">
                        Highlight significant past projects that showcase your organization's impact, 
                        expertise, and track record. Focus on projects that demonstrate your 
                        organization's capabilities, lessons learned, and successful outcomes.
                    </p>
                </div>

                {projects.map((project, index) => (
                    <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="mb-4">
                            <label 
                                htmlFor={`projectName-${index}`} 
                                className="block m font-medium text-gray-700 mb-2"
                            >
                                Project Name
                            </label>
                            <input
                                type="text"
                                id={`projectName-${index}`}
                                name="projectName"
                                value={project.projectName}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="E.g., Community Health Awareness Campaign 2022"
                                className="w-full rounded-md border border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                            />
                        </div>

                        <div>
                            <label 
                                htmlFor={`description-${index}`} 
                                className="block m font-medium text-gray-700 mb-2"
                            >
                                Description
                            </label>
                            <AutoResizeTextarea
                                name="description"
                                value={project.description}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Describe the project's objectives, key achievements, impact, and any notable outcomes or learnings."
                            />
                        </div>

                        {projects.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => handleRemoveProject(index)} 
                                className="mt-4 text-sm rounded-md font-semibold px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200"
                            >
                                Remove Project
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end mb-20">
                <button 
                    type="button" 
                    onClick={handleAddProject} 
                    className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                    + Add Another Project
                </button>
            </div>

            <hr className="border-gray-200" />
        </div>
    );
});

export default PreviousProjectsList;
