const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { accountExists, register } = require('../db');

router.post('/register', async (req,res) => {
    const { email, password } = req.body;

    try {
        const existing = await accountExists(email);
        if(existing.rows.length > 0){
            return res.status(400).json({message: 'User already exists'});
        }

        register(email, password);
        res.json({ message: 'User registered successfully'});
    }catch (err){
        console.error(err);
        res.status(500).json({message: 'Registration failed'});
    }
});

router.post('/login', async (req,res) => {
    const {email, password} = req.body;

    try{
        const result = await accountExists(email);
        const user = result.rows[0];

        if(!user || user.password != password){
            return res.status(400).json({message: 'Incorrect password'});
        }
        // TODO: Fix secret key later
        const token = jwt.sign({userId: user.id}, 'asdfjlkasd', {expiresIn:'1h'});
        res.json({message: 'Login successful', token});
    }catch (err){
        console.error(err);
        res.status(500).json({message: 'Login failed'});
    }
});

module.exports = router;