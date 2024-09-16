import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import CreatableSelect from "react-select/creatable";
import { useApi } from '../../contexts/ApiProvider';

// Query db for tech and non-tech skills
const fetchSkills = async (apiClient) => {
    const response = await apiClient.get('/all_skills');
    
    if (response.status === 200) {
        const skills = response.body.skills;
        const techSkillList = skills.filter(skill => skill.status === 'tech');
        const nonTechSkillList = skills.filter(skill => skill.status === 'non-tech');
        return { techSkillList, nonTechSkillList };
    } else {
        throw new Error('Error fetching skills');
    }
};

const SupportNeeds = forwardRef((props, ref) => {
    const [techSkills, setTechSkills] = useState([]);
    const [techSkillsOptions, setTechSkillOptions] = useState([]);
    const [nonTechSkills, setNonTechSkills] = useState([]);
    const [nonTechSkillsOptions, setNonTechSkillOptions] = useState([]);
    const [needVolunteers, setNeedVolunteers] = useState(false);
    const apiClient = useApi();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const skills = await fetchSkills(apiClient);
                
                const techSkillsOptions = skills.techSkillList.map(skill => ({ value: skill.skill, label: skill.skill }));
                setTechSkillOptions(techSkillsOptions);
                
                const nonTechSkillsOptions = skills.nonTechSkillList.map(skill => ({ value: skill.skill, label: skill.skill }));
                setNonTechSkillOptions(nonTechSkillsOptions);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };
        
        fetchData();
    }, [apiClient]);

    const handleVolunteerCheck = (event) => {
        setNeedVolunteers(event.target.checked);
    };

    const handleTechSkillChange = (newSelectedSkills) => {
        setTechSkills(newSelectedSkills.map(skill => ({...skill, description: ''})));
    };

    const handleNonTechSkillChange = (newSelectedSkills) => {
        setNonTechSkills(newSelectedSkills.map(skill => ({...skill, description: ''})));
    };

    const handleSkillDescriptionChange = (index, description, istech) => {
        if (istech) {
            const newTechSkills = [...techSkills];
            newTechSkills[index].description = description;
            setTechSkills(newTechSkills);
        } else {
            const newNonTechSkills = [...nonTechSkills];
            newNonTechSkills[index].description = description;
            setNonTechSkills(newNonTechSkills);
        }
    };

    const getData = () => {
        return { techSkills, nonTechSkills };
    }

    useImperativeHandle(ref, () => ({ getData }));

    return (
        <div>
            <div className="mb-8 my-6 ">
                <input
                    type="checkbox"
                    checked={needVolunteers}
                    onChange={handleVolunteerCheck}
                    className="checked:bg-teal-500 checked:border-transparent bg-gray-100 border border-gray-300 rounded focus:ring focus:ring-offset-2 focus:ring-teal-500"
                />
                <label> We would like Volunteers</label>
            </div>
            {needVolunteers && (
                <div>
                    <div className="mb-4">
                        <label>Technical Skills Needed:</label>
                        <CreatableSelect
                            id="techSkills"
                            isMulti
                            options={techSkillsOptions}
                            value={techSkills}
                            onChange={handleTechSkillChange}
                            placeholder="Select or type to add"
                        />
                        {techSkills.map((skill, index) => (
                            <div key={index} className="mt-2">
                                <label>{skill.label} Description:</label>
                                <textarea
                                    value={skill.description}
                                    onChange={(e) => handleSkillDescriptionChange(index, e.target.value, true)}
                                    className="w-full p-2 border rounded"
                                    placeholder={`Describe what you need for ${skill.label}`}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="mb-4">
                        <label>Non-Technical Skills Needed:</label>
                        <CreatableSelect
                            id="nonTechSkills"
                            isMulti
                            options={nonTechSkillsOptions}
                            value={nonTechSkills}
                            onChange={handleNonTechSkillChange}
                            placeholder="Select or type to add"
                        />
                        {nonTechSkills.map((skill, index) => (
                            <div key={index} className="mt-2">
                                <label>{skill.label} Description:</label>
                                <textarea
                                    value={skill.description}
                                    onChange={(e) => handleSkillDescriptionChange(index, e.target.value, false)}
                                    className="w-full p-2 border rounded"
                                    placeholder={`Describe what you need for ${skill.label}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default SupportNeeds;