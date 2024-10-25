const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 5000;

app.use(express.json());

const cors = require('cors');
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Basic route to test if the server is working
app.get('/', (req, res) => {
  res.send('Rule Engine API is running!');
});

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/ruleEngine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define the Rule Schema
const RuleSchema = new mongoose.Schema({
  ruleString: { type: String, required: true },
});
const Rule = mongoose.model('Rule', RuleSchema);

// Define the Node class for AST
class Node {
  constructor(type, value = null, left = null, right = null) {
    this.type = type;  // "operator" or "operand"
    this.value = value; // Optional value for operand nodes
    this.left = left;   // Left child (Node)
    this.right = right; // Right child (Node)
  }
}

// Create rule function
function create_rule(rule_string) {
    const tokens = rule_string.match(/(\s*AND\s*|\s*OR\s*|\(|\)|\w+\s*(<=|>=|<|>|=)\s*'.*?'|\w+\s*(<=|>=|<|>|=)\s*\d+)/g);
    const outputQueue = [];
    const operatorStack = [];
  
    for (const token of tokens) {
        const trimmedToken = token.trim();
  
        if (trimmedToken === "AND" || trimmedToken === "OR") {
            while (operatorStack.length && precedence(operatorStack[operatorStack.length - 1]) >= precedence(trimmedToken)) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(trimmedToken);
        } else if (trimmedToken === "(") {
            operatorStack.push(trimmedToken);
        } else if (trimmedToken === ")") {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // Remove the opening bracket
        } else {
            const [field, operator, value] = trimmedToken.split(/(<=|>=|<|>|=)/).map(item => item.trim());
            outputQueue.push(new Node("operand", {
                field: field,
                operator: operator,
                value: isNaN(value) ? value.replace(/'/g, "") : Number(value)
            }));
        }
    }
  
    // Pop all remaining operators from the stack
    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }
  
    // Build the AST from the output queue (Reverse Polish Notation)
    const stack = [];
    for (const item of outputQueue) {
        if (item instanceof Node && item.type === "operand") {
            stack.push(item);
        } else {
            const right = stack.pop();
            const left = stack.pop();
            stack.push(new Node("operator", item, left, right));
        }
    }
  
    return stack[0]; // Return the root node of the AST
}



  // Helper function to define operator precedence
function precedence(operator) {
    if (operator === "AND") return 2;
    if (operator === "OR") return 1;
    return 0;
  }

  

// Combine rules function
function combine_rules(rules) {
  if (rules.length === 0) return null;

  let combinedAST = create_rule(rules[0]);

  for (let i = 1; i < rules.length; i++) {
    const currentAST = create_rule(rules[i]);
    combinedAST = new Node("operator", "AND", combinedAST, currentAST);
  }

  return combinedAST;
}

// Evaluate rule function
function evaluate_rule(ast, data) {
  console.log("evaluate_rule called with:", { ast, data });
  if (!ast) return false;

  if (ast.type === "operand") {
    const { field, operator, value } = ast.value;

    // Log the field, operator, and value
    console.log(`Evaluating: field=${field}, operator=${operator}, expectedValue=${value}, actualValue=${data[field]}`);

    // Check if the field exists in data
    if (data[field] === undefined) {
      console.log(`Field ${field} is missing in the data.`);
      return false; // Handle missing field case
    }

    switch (operator) {
      case ">":
        return data[field] > value;
      case "<":
        return data[field] < value;
      case ">=":
        return data[field] >= value;
      case "<=":
        return data[field] <= value;
      case "=":
      case "==":
        if (typeof data[field] === 'string' && typeof value === 'string') {
          return data[field].toLowerCase() === value.toLowerCase();
        }
        return data[field] == value; // Use loose equality for other types
      default:
        console.log(`Unsupported operator: ${operator}`);
        return false;
    }
  } else if (ast.type === "operator") {
    const leftEval = evaluate_rule(ast.left, data);
    const rightEval = evaluate_rule(ast.right, data);

    console.log(`Operator: ${ast.value}, Left Result: ${leftEval}, Right Result: ${rightEval}`);

    if (ast.value === "AND") return leftEval && rightEval;
    if (ast.value === "OR") return leftEval || rightEval;
  }

  return false;
}

// API to evaluate a rule
app.post('/evaluate_rule', (req, res, next) => {
  const { ast, data } = req.body; // Expecting AST and data in request body

  // Basic validation
  if (!ast || !data) {
    return res.status(400).json({ message: 'AST and data are required' });
  }

  try {
    const result = evaluate_rule(ast, data); // Call to evaluate the rule
    res.json({ result }); // Respond with the result
  } catch (error) {
    console.error(error); // Log error for debugging
    next(error); // Pass the error to the error handling middleware
  }
});

// Get all rules
app.get('/rules', async (req, res, next) => {
  try {
    const rules = await Rule.find(); // Fetch all rules from the database
    res.json(rules); // Send the fetched rules as a JSON response
  } catch (error) {
    console.error(error); // Log error for debugging
    next(error); // Pass the error to the error handling middleware
  }
});

// Create a new rule
app.post('/rules', 
  body('ruleString')
    .isString().withMessage('Rule string must be a string')
    .notEmpty().withMessage('Rule string cannot be empty'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ruleString } = req.body; // Expecting ruleString in request body

    try {
      const newRule = new Rule({ ruleString });
      await newRule.save(); // Save the new rule to the database
      res.status(201).json(newRule); // Respond with the created rule
    } catch (error) {
      console.error(error); // Log error for debugging
      next(error); // Pass the error to the error handling middleware
    }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}, // Send stack trace only in development
  });
});


// const rule1 = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
// const rule2 = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";

// const ast1 = create_rule(rule1);
// const ast2 = create_rule(rule2);

// console.log(JSON.stringify(ast1, null, 2));
// console.log(JSON.stringify(ast2, null, 2));


// // Sample data
// const sampleData1 = { age: 35, department: "Sales", salary: 60000, experience: 3 };
// const sampleData2 = { age: 22, department: "Marketing", salary: 25000, experience: 6 };

// // Evaluate rules based on the sample data
// const result1 = evaluate_rule(ast1, sampleData1);
// const result2 = evaluate_rule(ast2, sampleData2);

// console.log(result1); // Should return true or false based on rule1
// console.log(result2); // Should return true or false based on rule2


// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
