// src/components/RuleForm.js
import React, { useState } from 'react';
import { createRule } from '../services/api';

const RuleForm = () => {
    const [ruleString, setRuleString] = useState('');

    const [successMessage, setSuccessMessage] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const result = await createRule(ruleString);
        setSuccessMessage('Rule created successfully!');
        setRuleString(''); // Clear the input after submission
    } catch (error) {
        console.error('Error creating rule:', error);
        setSuccessMessage('Failed to create rule. Please try again.');
    }
};

return (
    <div>
        <h2>Add New Rule</h2>
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={ruleString} 
                onChange={(e) => setRuleString(e.target.value)} 
                placeholder="Enter rule string" 
                required 
            />
            <button type="submit">Add Rule</button>
        </form>
        {successMessage && <div>{successMessage}</div>}
    </div>
);
};

export default RuleForm;
