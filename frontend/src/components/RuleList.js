// src/components/RuleList.js
import React, { useEffect, useState } from 'react';
import { getRules } from '../services/api';

const RuleList = () => {
    const [rules, setRules] = useState([]);
    const [error, setError] = useState(null); // Add state for error handling

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const fetchedRules = await getRules();
                setRules(fetchedRules);
            } catch (error) {
                setError(error.message); // Set the error message if the fetch fails
            }
        };
        fetchRules();
    }, []);

    return (
        <div>
            <h2>Rule List</h2>
            {error && <div style={{ color: 'red' }}>Error: {error}</div>} {/* Display error message */}
            <ul>
                {rules.map((rule, index) => (
                    <li key={index}>{rule.ruleString}</li>
                ))}
            </ul>
        </div>
    );
};

export default RuleList;
