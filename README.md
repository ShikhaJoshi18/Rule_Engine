# Rule Engine
The Rule Engine is a full-stack application that allows users to define and evaluate rules dynamically. It provides a user-friendly interface for rule management and evaluation using a React frontend and a Node.js backend.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up MongoDB with Docker](#setting-up-mongodb-with-docker)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Features
- **Rule Management**: Create, view, and delete rules from a centralized dashboard.
- **Rule Evaluation**: Evaluate rules against provided data inputs with real-time results.
- **Rule Evaluation**: Combine multiple rules into a single rule for complex evaluations.
- **User Friendly Interface**: Intuitive React-based UI for easy rule management.

## Project Structure
The project is organized as follows:

rule-engine/
├── backend.js               # Backend server for rule handling and API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RuleEvaluation.js  # Component for evaluating rules
│   │   │   ├── RuleForm.js        # Component for creating new rules
│   │   │   └── RuleList.js        # Component for listing all rules
│   │   └── App.js                 # Main application file for React
└── README.md                      # Project documentation


## Prerequisites
Ensure you have the following installed:

1. Node.js and npm
2. Docker (for setting up MongoDB as a Docker container)
   

## Installation
1. Clone the repository

2. Install dependencies: Navigate to the project’s root directory and install the required packages.
   npm install

3. Install Frontend Dependencies: Navigate to the frontend folder and install frontend dependencies (if using a separate setup).
   
   cd frontend
   npm install


## Setting Up MongoDB with Docker

This application uses MongoDB with a database named ruleEngine and one collection: rules. Follow these steps to set up MongoDB in a Docker container with the required database and collections.
[Step 1: Create the Initialization Script]
1. In the project root directory, create a folder named mongo-init.
2. Inside the mongo-init folder, create a file named init.js with the following contents:
   
  // init.js - Initializes ruleEngine database with the rules collection
  db = db.getSiblingDB("ruleEngine");
  db.createCollection("rules");
  // Optional: Insert initial sample data
  db.rules.insert({ ruleString: "Sample Rule", createdAt: new Date() });

[Step 2: Run MongoDB with Docker]

docker run --name rule-engine-mongo -d -p 27017:27017 -v ruledata:/data/db -v $(pwd)/mongo-init:/docker-entrypoint-initdb.d mongo

[Step 3: Verify the Setup (Optional)]

1. To verify the database and collection, connect to MongoDB
   docker exec -it rule-engine-mongo mongosh
2. Then switch to the ruleEngine database and check the collections:
   use ruleEngine;
  show collections;

  You should see rules listed.

## Usage

1. Start the Backend Server:  node backend.js
2. Start the Frontend: From the frontend folder, start the React development server: npm start
3. Access the Application: Open http://localhost:3000 in your browser to view the Weather Monitoring Dashboard.


## Technologies Used

Frontend: React.js, CSS (Bootstrap)
Backend: Node.js, Express.js
Database: MongoDB (Dockerized for easy setup)


Notes
1. The node_modules folder is not included in the repository due to its size. Run npm install to install dependencies after cloning.
2. The application is designed to handle rule evaluation and combination dynamically, making it suitable for various rule-based scenarios.

