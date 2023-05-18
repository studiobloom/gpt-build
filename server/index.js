require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
const greenlock = require('greenlock-express');
const app = express();

// Enable CORS
app.use(cors({
  origin: ['https://your-website.com', 'https://www.your-website.com'] // ADD YOUR WEBSITE'S URL HERE
}));

// Serve static files from Webflow build
app.use(express.static(path.join(__dirname, '..', 'web', 'WEBFLOW_BUILD_FOLDER'))); // THIS MUST MATCH YOUR FOLDER STRUCTURE, RENAME THIS TO YOUR WEBFLOW FOLDER

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Create an API route
app.post('/api', async (req, res) => {
    const { name, location, birthdate, question } = req.body;

    const messages = [
        {            
            role: "system",
            // CUSTOMIZE THIS, IT SETS THE SYSTEM 'ENVIRONMENT' SO TO SPEAK; EXPLAIN WHAT GPT IS DOING
            content: `INSERT SYSTEM MESSAGE HERE(INITAL PROMPT)`             
        },
        {
            role: "user",
            // THIS IS WHERE TO FEED COLLECTED FORM DATA FROM THE SITE. YOU CAN CUSTOMIZE AND ADD FIELDS, 
            // ENSURE THE TAGS ARE CORRECT IF CUSTOMIZED/ADDED, THEY MUST BE MODIFIED IN THE WEBFLOW BUILD AS WELL
            content: `INSERT INITAL USER MESSAGE WITH DATA COLLECTION FIELDS ${name}${birthdate}${location}${question}` 
        }
    ];

    // OpenAI API endpoint
    const apiUrl = 'https://api.openai.com/v1/chat/completions'; 

    const apiKey = process.env.API_KEY; // ENSURE YOUR OPENAI API KEY IS ADDED TO THE .ENV FILE LOCATED AT FLOW-GPT/SERVER/.ENV

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const result = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ model: 'gpt-3.5-turbo', messages })
        });

        const jsonResult = await result.json();

        res.json(jsonResult);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Initialize greenlock-express
const lex = greenlock.init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: 'your-email@gmail.com', // ADD YOUR DOMAIN MANAGEMENT EMAIL HERE
    cluster: false
});

lex.serve(app);
