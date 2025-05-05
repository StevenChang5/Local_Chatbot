const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {getAccount, getConversations} = require('../db');

const verifyToken = require('../middleware/verifyToken');

router.get('/main_profile', verifyToken, async (req, res) => {
    try{
        const result = await getAccount(req.userId);
        const user = result[0];
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to load profile'});
    }
});

router.get('/conversations/:userId', async (req, res) =>{
    const userId = req.params.userId;
    try{
        const result = await getConversations(userId);
        res.json(result);
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
})

module.exports = router;