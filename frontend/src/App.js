// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import RuleForm from './components/RuleForm';
import RuleList from './components/RuleList';
import RuleEvaluation from './components/RuleEvaluation';
import './App.css'; // Add a CSS file for custom styles

function App() {
    return (
        <Router>
            <div className="app-container">
                <h1 className="app-title">Rule Engine</h1>
                <nav className="app-navbar">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/add-rule" className="nav-link">Add Rule</Link>
                    <Link to="/evaluate-rule" className="nav-link">Evaluate Rule</Link>
                </nav>
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<RuleList />} />
                        <Route path="/add-rule" element={<RuleForm />} />
                        <Route path="/evaluate-rule" element={<RuleEvaluation />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
