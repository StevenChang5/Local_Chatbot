const express = require('express');
const router = express.Router();

const users = {};

router.post('/register', (req,res) => {
    const { email, password } = req.body;

    if (users[email]) return res.status(400).json({message: 'User already exists'});

    users[email] = password;
    res.json({message: 'User registered successfully'});
})

router.post('/login', (req,res) => {
    const {email, password} = req.body;

    if(!users[email]) return res.status(400).json({message: 'User not found'});
    if(users[email] !== password) return res.status(401).json({message: 'Incorrect password'});
    
    res.json({message: 'Login successful'});
})

module.exports = router;