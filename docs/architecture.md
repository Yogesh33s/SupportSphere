# SupportSphere Architecture

SupportSphere uses a simple three-part architecture:

```text
User Browser
    |
    v
Frontend: HTML, CSS, JavaScript
    |
    v
Backend: Java Spring Boot REST API
    |
    v
Database: MongoDB
```

## Backend Layers

- Controller: Handles API requests from the frontend.
- Service: Contains business rules such as status updates and completion handling.
- Repository: Connects the backend to MongoDB.
- Model: Defines the help request document structure.

## DevOps Flow

- Developers push code to GitHub.
- GitHub Actions runs basic CI checks.
- Jenkins can run build, test, Docker image creation, and deployment stages.
- Docker Compose runs frontend, backend, and MongoDB together.

## Why This Structure Is Beginner-Friendly

- Each technology has its own clear folder.
- Backend code follows standard Spring Boot layering.
- Frontend stays simple with plain HTML, CSS, and JavaScript.
- Docker and CI/CD files are at predictable project locations.
- The structure is easy to explain in viva using request flow and deployment flow.
