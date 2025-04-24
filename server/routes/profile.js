const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

const verifyToken = require('../middleware/verifyToken');

router.get('/main_profile', verifyToken, async (req, res) => {
    try{
        const result = await db.query('SELECT id, email FROM users WHERE id = $1', [req.userId]);
        const user = result.rows[0];
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to load profile'});
    }
});

router.get('/conversations/:userId', async (req, res) =>{
    const userId = req.params.userId;
    try{
        const result = await db.query(
            'SELECT id, title, created_at FROM conversations WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
})

module.exports = router;