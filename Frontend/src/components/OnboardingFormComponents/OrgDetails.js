import { useState, forwardRef, useImperativeHandle } from "react";

const OrgDetails = forwardRef((props, ref) => {
    const [state, setState] = useState({
        orgName: "",
        aboutOrg: "",
    });
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const getData = () => {
        const { orgName, aboutOrg } = state;
        return { orgName, aboutOrg };
    };

    useImperativeHandle(
        ref, 
        () => ({ getData }),
        [state]
    );

return (
    <div className="mt-4 p-6"> 
        <label htmlFor="orgNameInput" className="block text-xl font-medium text-gray-700">
        Name of Organisation:
        </label>
        <div className="mt-2 w-1/2"> 
        <input 
            type="text" 
            id="orgNameInput" 
            name="orgName" 
            value={state.orgName} 
            onChange={handleInputChange}
            className="flex-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        </div>  

        {/* About Org Input */}
        <label htmlFor="aboutOrgInput" className="block mt-4 text-xl font-medium text-gray-700">
        Overview
        </label>
        <div className="mt-2 w-3/4"> 
        <textarea 
            id="aboutOrgInput" 
            name="aboutOrg" 
            value={state.aboutOrg} 
            onChange={handleInputChange}
            className="flex-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        </div>  
    </div>  
    );
});
    
    

export default OrgDetails;
