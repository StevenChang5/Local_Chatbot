const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/ask', async (req, res) => {
    const { query, conversation_id } = req.body;
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            model: 'llama3',
            prompt: query,
            stream: false
        }),
    });

    const data = await response.json();
    res.json({ response: data.response });

    await db.query(
        'INSERT INTO messages (conversation_id, sender, message) VALUES ($1, $2, $3)',
        [conversation_id, 'user', query ]
    );

    db.query(
        'INSERT INTO messages (conversation_id, sender, message) VALUES ($1, $2, $3)',
        [conversation_id, 'bot', data.response ]
    );
});

module.exports = router;