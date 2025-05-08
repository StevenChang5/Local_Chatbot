const { Pool } = require('pg')

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if(err){
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

async function accountExists(email){
    const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result;
}

async function getAccount(userId){
    const result = await db.query(
        'SELECT id, email FROM users WHERE id = $1',
        [userId]
    )
    return result.rows;
}

async function register(email, password){
    await db.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
        [email, password]
    );
}

async function saveMessage(conversationId, role, content){
    await db.query(
        'INSERT INTO messages (conversation_id, sender, msg) VALUES ($1, $2, $3)',
        [conversationId, role, content]
    );
}

async function getMessages(converationId){
    const result = await db.query(
        'SELECT conversation_id, sender, msg FROM messages where conversation_id = $1 ORDER by created_at DESC',
        [converationId]
    );
    return result.rows;
}

async function newConversation(userId, title) {
    const result = await db.query(
        'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING id',
        [userId, title]
    );
    return result.rows[0].id;
}

async function getConversations(userId){
    const result = await db.query(
        'SELECT id, title, created_at FROM conversations WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return result.rows;
}

module.exports = {
    accountExists,
    getAccount,
    register,
    saveMessage,
    getMessages,
    newConversation,
    getConversations
};