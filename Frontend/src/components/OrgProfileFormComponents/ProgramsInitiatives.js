import React, { useState, forwardRef, useImperativeHandle } from 'react';

const ProgramInitiativesList = forwardRef((props, ref) => {
    const [initiatives, setInitiatives] = useState([
        { initiativeName: "", description: "" }, // Add initial initiative
    ]);

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
        values[index][event.target.name] = event.target.value;
        setInitiatives(values);
    };

    // Remove the initiative object at the given index
    const handleRemoveInitiative = (index) => {
        const values = [...initiatives];
        values.splice(index, 1); // Remove the element at the given index
        setInitiatives(values);
    };

    // Expose the getInitiativesData function to parent components
    useImperativeHandle(ref, () => ({
        getInitiativesData: () => initiatives, // Return the array of initiatives
    }));

return (
    <div className="flex flex-col justify-center">
        <div id="initiatives-container" className="mt-4 text-xl font-medium text-gray-700">
            <h2 className="text-2xl font-semibold mb-5 font-medium text-gray-900">Initiatives</h2>
            {initiatives.map((initiative, index) => (
            <div key={index} className="mb-8"> {/* Add spacing */}
                <div>
                <label htmlFor={`initiativeName-${index}`}>Initiative Name:</label>
                <input
                    type="text"
                    id={`initiativeName-${index}`} 
                    name="initiativeName"
                    value={initiative.initiativeName}
                    onChange={(e) => handleInputChange(index, e)}
                    className="flex-1 w-3/4 block rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor={`description-${index}`}>Description:</label>
                    <textarea
                        id={`description-${index}`} 
                        name="description"
                        value={initiative.description}
                        onChange={(e) => handleInputChange(index, e)}
                        className="flex-1 w-3/4 block rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                </div>

                <button type="button" onClick={() => handleRemoveInitiative(index)} class="text-sm rounded-md font-semibold px-3 py- w-1/10 leading-6 text-gray-900 hover:bg-indigo-500 hover:text-white">
                Cancel
                </button>
            </div>
            ))}
        </div>

        <div class="flex gap-x-6 justify-end mb-20">
            <button onClick={handleAddInitiative} class="rounded-md w-1/10 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            + Add Initiative 
            </button>
        </div>

        <hr className="border-gray-200" /> 

    </div>

);
}
);

export default ProgramInitiativesList; 
