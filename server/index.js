require('dotenv').config({ path : '../.env' });

const express = require('express')
const app = express();
const cors = require('cors')

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/chat', chatRoutes);

// React runs on port 3000 by default
app.listen(8080, ()=>{
    console.log('Server Listening on port 8080')
})