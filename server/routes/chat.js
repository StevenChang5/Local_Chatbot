const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/ask', async (req, res) => {
    const { query } = req.body;
    console.log('Query from User:', query)
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ model: 'llama3', query })
    });

    const data = await response.json();
    console.log('Response from Ollama:', data.response);
    res.json({ response: data.response });
    // console.log(response.message.content);

    // const data = await response.json();
    // res.json({ response: data.response });

    // db.query(
    //     'INSERT INTO messages (conversation_id, sender, message) VALUES ($1, $2, $3)',
    //     [1, 'user', question ]
    // );
});

module.exports = router;