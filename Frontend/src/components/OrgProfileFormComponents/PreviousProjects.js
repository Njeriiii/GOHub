import React, { useState, forwardRef, useImperativeHandle } from 'react';

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
        setProjects(values);
    };

    // Expose the getProjectsData function to parent components
    useImperativeHandle(ref, () => ({
        getProjectsData: () => projects, // Return the array of projects
    }));

return (
    <div className="flex flex-col justify-center">
        <div id="projects-container" className="mt-4 text-xl font-medium text-gray-700">
            <h2 className="text-2xl font-semibold mb-5 font-medium text-gray-900"> Previous Projects</h2>
            {projects.map((project, index) => (
            <div key={index} className="mb-8"> {/* Add spacing */}
                <div>
                <label htmlFor={`projectName-${index}`}>Project Name:</label>
                <input
                    type="text"
                    id={`projectName-${index}`} 
                    name="projectName"
                    value={project.projectName}
                    onChange={(e) => handleInputChange(index, e)}
                    className="flex-1 w-3/4 block rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor={`description-${index}`}>Description:</label>
                    <textarea
                        id={`description-${index}`} 
                        name="description"
                        value={project.description}
                        onChange={(e) => handleInputChange(index, e)}
                        className="flex-1 w-3/4 block rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                </div>

                <button type="button" onClick={() => handleRemoveProject(index)} class="text-sm rounded-md font-semibold px-3 py- w-1/10 leading-6 text-gray-900 hover:bg-indigo-500 hover:text-white">
                Cancel
                </button>
            </div>
            ))}
        </div>

        <div class="flex gap-x-6 justify-end mb-20">
            <button type="button" onClick={handleAddProject} class="rounded-md w-1/10 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            + Add Project 
            </button>
        </div>

        <hr className="border-gray-200" /> 

    </div>

);
}
);

export default PreviousProjectsList; 
