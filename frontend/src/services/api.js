// src/services/api.js
export const createRule = async (ruleString) => {
    try {
        const response = await fetch('http://localhost:5000/rules', {  // Full URL for API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ruleString }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to create rule:', error);
        throw error; // Propagate the error
    }
};

export const getRules = async () => {
    try {
        const response = await fetch('http://localhost:5000/rules'); // Specify full URL
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch rules:', error);
        throw error; // Propagate error
    }
};

export const evaluateRule = async (ast, data) => {
    try {
        const response = await fetch('http://localhost:5000/evaluate_rule', {  // Full URL for API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ast, data }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to evaluate rule:', error);
        throw error; // Propagate the error
    }
};
