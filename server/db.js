const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'chatbot_db',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err) => {
    if(err){
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

module.exports = pool;