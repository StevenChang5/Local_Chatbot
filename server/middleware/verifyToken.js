const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next){
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(403).json({message: 'No JWT token provided'});

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(err){
        res.status(403).json({message: 'Invalid token'});
    }
}

module.exports = verifyToken;