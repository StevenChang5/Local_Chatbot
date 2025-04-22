# QandA Chat
Chatbot using Llama3 and Langchain for local q&a and RAG services. 

## Prerequisites:
* Install Ollama locally on computer
* [MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

```bash
    npm install pg
```

## How to run:
1. Run PostgreSQL (Mac/homebrew commands) and create database
```bash
    brew services start postgresql

    // To Stop:
    brew services stop postgresql

    psql postgres

    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

    
```
2. Run Node.js server
```bash
    cd server
    node index.js
```
3. Run React app
```bash
    npm start
```
## Table schemas:
*   users:
```bash
id | email | password
```

*   conversations:
```bash
id | user_id | title | created_at
```

*   messages:
```bash
id | conversation_id | sender | message | timestamp
```