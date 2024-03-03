import React, { useState, forwardRef, useImperativeHandle } from 'react';

const MissionStatement = forwardRef((props, ref) => {
    const [statement, setStatement] = useState('');

    const handleInputChange = (event) => {
        setStatement(event.target.value);
    };

    const getData = () => {
        return statement;
    };

    useImperativeHandle(ref, () => ({ getData }));

return (
    <div className="p-6 w-3/4">  
        <h2 className="text-2xl font-medium mb-2">Mission Statement</h2> 
        <textarea 
        value={statement} 
        onChange={handleInputChange}
        className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
        />
    </div>
    );
});

export default MissionStatement;