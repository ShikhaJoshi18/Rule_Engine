// src/components/RuleEvaluation.js
import React, { useState } from 'react';
import { evaluateRule } from '../services/api';

const RuleEvaluation = () => {
    const [ast, setAst] = useState('');
    const [data, setData] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleEvaluate = async (e) => {
        e.preventDefault();
    
        try {
            const parsedData = JSON.parse(data); // Ensure data is valid JSON
            const parsedAst = JSON.parse(ast); // Parse the AST to an object
            console.log("Parsed AST:", parsedAst); // Log the parsed AST
            const evaluationResult = await evaluateRule(parsedAst, parsedData);
            setResult(evaluationResult);
            console.log("Evaluation Result:", evaluationResult);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Invalid data format. Please enter valid JSON.'); // JSON parsing error
        }
    };
    

    return (
        <div>
            <h2>Evaluate Rule</h2>
            <form onSubmit={handleEvaluate}>
                <input 
                    type="text" 
                    value={ast} 
                    onChange={(e) => setAst(e.target.value)} 
                    placeholder="Enter AST" 
                    required 
                />
                <input 
                    type="text" 
                    value={data} 
                    onChange={(e) => setData(e.target.value)} 
                    placeholder="Enter data" 
                    required 
                />
                <button type="submit">Evaluate</button>
            </form>
            {result && <div>Result: {JSON.stringify(result)}</div>}
        </div>
    );
};

export default RuleEvaluation;