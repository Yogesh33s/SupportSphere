# SupportSphere

SupportSphere is a beginner-friendly full-stack project for managing community help requests.

Users can:
- Create help requests
- View all requests
- Mark requests as completed
- Store request data in MongoDB

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Java 17, Spring Boot, Maven
- Database: MongoDB
- Containers: Docker and Docker Compose
- Web server: nginx for the frontend container

## Project Structure

```text
SupportSphere/
|-- backend/
|   |-- src/main/java/com/supportsphere/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- model/
|   |   `-- repository/
|   |-- src/main/resources/application.properties
|   |-- Dockerfile
|   `-- pom.xml
|-- frontend/
|   |-- index.html
|   |-- script.js
|   |-- style.css
|   |-- nginx.conf
|   `-- Dockerfile
|-- docker-compose.yml
`-- README.md
```

## Local Execution

Use local execution when you want to run each part manually on your machine.

### 1. Start MongoDB locally

MongoDB must be running on:

```text
mongodb://localhost:27017/supportsphere
```

If you have Docker installed, you can start only MongoDB with:

```powershell
docker run --name supportsphere-local-mongodb -p 27017:27017 -v supportsphere-local-mongo-data:/data/db -d mongo:7
```

### 2. Start the backend

```powershell
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080/api/requests
```

### 3. Start the frontend

Open a new terminal from the project root:

```powershell
cd frontend
python -m http.server 3000
```

Frontend URL:

```text
http://localhost:3000
```

## Docker Execution

Use Docker execution for the easiest viva demonstration. Docker Compose starts the frontend, backend, and MongoDB together.

### Start all containers

```powershell
docker compose up --build
```

### Start all containers in the background

```powershell
docker compose up --build -d
```

### Check running containers

```powershell
docker compose ps
```

### Stop containers

```powershell
docker compose down
```

### Stop containers and remove MongoDB data

Only use this when you intentionally want to delete saved MongoDB data:

```powershell
docker compose down -v
```

## Docker URLs

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080/api/requests
MongoDB:  localhost:27017
```

## Configuration Notes

- The backend reads MongoDB from `MONGO_URI` when Docker Compose is used.
- If `MONGO_URI` is not set, the backend uses `mongodb://localhost:27017/supportsphere`.
- Docker Compose uses the MongoDB service name `mongodb` for container networking.
- MongoDB data is stored in the named Docker volume `mongo-data`.
- The frontend container uses nginx and can proxy `/api` requests to the backend container.
- CORS allows local frontend origins `http://localhost:3000` and `http://127.0.0.1:3000`.

## Viva Explanation

SupportSphere has three services:

- The frontend container serves the website using nginx.
- The backend container runs the Spring Boot REST API on Java 17.
- The MongoDB container stores help request data permanently using a Docker volume.

All containers share one Docker network, so the backend can connect to MongoDB using:

```text
mongodb://mongodb:27017/supportsphere
```
