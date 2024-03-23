import { useState, forwardRef, useImperativeHandle } from "react";

const AdminDetails = forwardRef((props, ref) => {
    const [state, setState] = useState({
        name: "",
        role: "",
        email: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const getData = () => {
        const { name, role, email } = state;
        return { name, role, email };
    };

    // Expose the getData function to parent components
    // forwardRef and useImperativeHandle allow a parent component to access the getData function on this AdminDetails component.
    useImperativeHandle(
        ref, 
        () => ({ getData }), 
        [state] 
    );

    return (
        <div className="mt-10 grid grid-cols-1 p-6 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
                <label htmlFor="adminName" className="block text-xl font-medium leading-6 text-gray-900">
                Name:
                </label>
                <div className="mt-2">
                    <div className="flex rounded-md w-3/4 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-xl"> </span>

                        <input 
                            type="text" 
                            id="adminName" 
                            name="name"   // Added name attribute
                            value={state.name} 
                            onChange={handleInputChange}
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Njeri Kamau"
                        />
                    </div>
                </div>
            </div>
        
            <div className="col-span-full">
                <label htmlFor="adminRole" className="block text-xl font-medium leading-6 text-gray-900">
                    Role in Organization:
                </label>
                <div className="mt-2 w-1/2">
                    <textarea
                        type="text" 
                        id="adminRole" 
                        name="role"   // Added name attribute
                        rows = {2}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Content Manager"
                        value={state.role} 
                        onChange={handleInputChange} 
                    />
                </div>
            </div>

            {/* email */}
            <div className="col-span-full">
                <label htmlFor="adminEmail" className="block text-xl font-medium leading-6 text-gray-900">
                    Email:
                </label>
                <div className="mt-2 w-1/2">
                    <input
                        type="text" 
                        id="adminEmail" 
                        name="email"   // Added email attribute
                        rows = {2}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder=""
                        value={state.email}
                        onChange={handleInputChange}
                />
                </div>
            </div>
        </div>
    );
});

export default AdminDetails;
