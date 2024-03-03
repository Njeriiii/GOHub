import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import CreatableSelect from "react-select/creatable";
// import 'react-selectable/css/styles.css'; // Include default styles


const SupportNeeds = forwardRef((props, ref) => {

    const [techSkills, setTechSkills] = useState([]);
    const [nonTechSkills, setNonTechSkills] = useState([]);

    const [needVolunteers, setNeedVolunteers] = useState(false);

    const techSkillOptions = [
        { value: 'Web Development', label: 'Web Development' },
        { value: 'Python', label: 'Python' },
        { value: 'UI/UX Design', label: 'UI/UX Design' },// ... more tech skills ...
        ];
    const nonTechSkillOptions = [
        { value: 'Fundraising', label: 'Fundraising' },
        { value: 'Event Planning', label: 'Event Planning' },
        { value: 'Social Media', label: 'Social Media' },// ... more non-tech skills ...
    ];

    const handleVolunteerCheck = (event) => {
        setNeedVolunteers(event.target.checked);
    };

    const handleTechSkillChange = (newSelectedSkills) => {
        setTechSkills(newSelectedSkills); 
    };

    const handleNonTechSkillChange = (newSelectedSkills) => {
    setNonTechSkills(newSelectedSkills);
    };

    const getSupportNeedsData = () => {
        return { techSkills, nonTechSkills };
    }

    useImperativeHandle(ref, () => ({ getSupportNeedsData }));

    return (
        <div>
            <div className="mb-8 my-6 "> 
                <input 
                type="checkbox" 
                checked={needVolunteers} 
                onChange={handleVolunteerCheck} 
                className="checked:bg-indigo-500 checked:border-transparent bg-gray-100 border border-gray-300 rounded focus:ring focus:ring-offset-2 focus:ring-indigo-500"/>
                <label> We would like Volunteers</label>
            </div>
            {needVolunteers &&(
                <div>
                    <div className="mb-4">
                        <label>Technical Skills Needed:</label>

                        <CreatableSelect
                        id="techSkills"
                        isMulti
                        options={techSkillOptions}
                        value={techSkills}
                        onChange={handleTechSkillChange}
                        placeholder="Select or type to add"
                        />
                    </div>

                    <div className="mb-4">
                        <label>Non-Technical Skills Needed:</label>
                        <CreatableSelect
                        id="nonTechSkills"
                        isMulti
                        options={nonTechSkillOptions}
                        value={nonTechSkills}
                        onChange={handleNonTechSkillChange}
                        placeholder="Select or type to add"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
);

export default SupportNeeds;