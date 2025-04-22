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

module.exports = router;