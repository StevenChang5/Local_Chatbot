const { Pool } = require('pg');
const { OllamaEmbeddings } = require("@langchain/ollama");
const { PGVectorStore } = require("@langchain/community/vectorstores/pgvector");

const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://ollama:11434"
});

const config = {
    postgresConnectionOptions: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    },
    tableName: "embeddings",
    columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
    },
    distanceStrategy: "cosine"
}

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

async function insertEmbedding(docs){
    const vectorStore = await PGVectorStore.initialize(embeddings, config);
    await vectorStore.addDocuments(docs);
}

async function getEmbedding(query, conversation_id){
    const vectorStore = await PGVectorStore.initialize(embeddings, config);
    const result = await vectorStore.similaritySearch(query, 1, { conversation: conversation_id});
    return result;
}

module.exports = {
    accountExists,
    getAccount,
    register,
    saveMessage,
    getMessages,
    newConversation,
    getConversations,
    insertEmbedding,
    getEmbedding
};