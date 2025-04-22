const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/register', async (req,res) => {
    const { email, password } = req.body;

    try {
        const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if(existing.rows.length > 0){
            return res.status(400).json({message: 'User already exists'});
        }

        await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
        res.json({ message: 'User registered successfully'});
    }catch (err){
        console.error(err);
        res.status(500).json({message: 'Registration failed'});
    }
});

router.post('/login', async (req,res) => {
    const {email, password} = req.body;

    try{
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if(!user || user.password != password){
            return res.status(400).json({message: 'Incorrect password'});
        }
        res.json({message: 'Login successful'});
    }catch (err){
        console.error(err);
        res.status(500).json({message: 'Login failed'});
    }
});

module.exports = router;