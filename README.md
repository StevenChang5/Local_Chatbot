# QandA Chat
The purpose of this app is to create a deployable chatbot for usage by individuals and companies locally, without having to rely on cloud-based services. 

## How to run using Docker:
1. Create .env file containing the following:
```bash
DB_USER=postgres
DB_PASSWORD=(i.e. 'password')
DB_HOST=db
DB_PORT=5432
DB_NAME=chatbot_db
JWT_SECRET=(i.e. 1234)
```
2. Build docker containers
```bash
    docker compose up
```
3. Access at http://localhost:3000