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

    try{
        await db.query(
            'INSERT INTO messages (conversation_id, sender, message) VALUES ($1, $2, $3)',
            [conversation_id, 'user', query ]
        );
    
        await db.query(
            'INSERT INTO messages (conversation_id, sender, message) VALUES ($1, $2, $3)',
            [conversation_id, 'bot', data.response ]
        );
    }catch(err){
        console.error('Error inserting conversations:',err);
        res.status(500).json({ error: 'Failed to insert conversations' });
    }

    try{
        const result = await db.query(
            'SELECT conversation_id, sender, message FROM messages WHERE conversation_id = $1 ORDER BY timestamp DESC',
            [conversation_id]
        )
        res.json(result.rows);
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
    
});

router.get('/history/:conversationId', async (req, res) => {
    const conversationId = req.params.conversationId;
    try{
        const result = await db.query(
            'SELECT conversation_id, sender, message FROM messages WHERE conversation_id = $1 ORDER BY timestamp DESC',
            [conversationId]
        );
        res.json(result.rows);
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
})

router.post('/newConversation', async(req,res) => {
    const { query, profile } = req.body;
    const titleResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            model: 'llama3',
            prompt: `Generate a title for the following query that summarizes the topic of the query. 
                    The title should be short and only a few words. 
                    Do not put the title in quotations. \n` + query,
            stream: false
        })
    })
    const titleData = await titleResponse.json();
    const title = titleData.response;

    const conversationResult = await db.query(
        'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING id',
        [profile.id, title] 
    );
    const conversation_id = conversationResult.rows[0].id;

    const queryResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3',
            prompt: query,
            stream: false
        })
    });

    const responseData = await queryResponse.json();

    try{
        await db.query(
            'INSERT INTO messages (conversation_id, sender, message) VALUES ($1, $2, $3)',
            [ conversation_id, 'user', query ]
        );
    
        db.query(
            'INSERT INTO messages (conversation_id, sender, message) VALUES ($1, $2, $3)',
            [ conversation_id, 'bot', responseData.response ]
        );
    }catch(err){
        console.error('Error inserting conversations:',err);
        res.status(500).json({ error: 'Failed to insert conversations' });
    }

    try{
        const result = await db.query(
            'SELECT conversation_id, sender, message FROM messages WHERE conversation_id = $1 ORDER BY timestamp DESC',
            [conversation_id]
        )
        res.json({history: result.rows, conversation_id: conversation_id});
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }

});

module.exports = router;