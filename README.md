# Local Chatbot
## About
The application is a privacy-focused, self-hosted AI chatbot designed for individuals and organizations that need the functionality of LLMs without relying on cloud services. It runs entirely on your own infrastructure using Ollama for language models, and provides features such as retrieval-augmented generation for document queries. This setup ensures secure documents never leave your local network, making it ideal for internal enterprise use and confidential workspaces. 
## Installation (From Docker Image)
### Steps 
1. Clone the repository
2. Create a `.env` file containing the following:
```bash
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=db
DB_PORT=5432
DB_NAME=chatbot_db
JWT_SECRET=your_secret_key
```
3. Build Docker containers:
```bash
docker-compose up
```
4. Access the app at `http://localhost:3000`
## Installation (From Source)
### Prerequisites
- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Ollama](https://ollama.com)
### Steps
1. Clone the repository
2. Install dependencies:
```bash
# React Frontend
cd client
npm install

# Node.js Backend
cd ../server
node index.js
```
3. Start PostgreSQL server:
```bash
psql -U postgres -h db -p 5432 -c "CREATE DATABASE chatbot_db;"
psql -U postgres -h db -p 5432 -d chatbot_db -f scripts/init.sql
```
4. Run Ollama and install models:
```bash
ollama serve
ollama pull llama3
ollama pull nomic-embed-text
```
