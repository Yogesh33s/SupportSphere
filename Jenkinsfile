pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checkout source code'
            }
        }

        stage('Backend Build') {
            steps {
                echo 'Build Spring Boot backend with Maven'
            }
        }

        stage('Backend Test') {
            steps {
                echo 'Run backend tests'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Build Docker images for frontend and backend'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy with Docker Compose'
            }
        }
    }
}
