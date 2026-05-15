# Dockerfile for the Spring Boot backend.
# This file builds the application JAR first, then runs it with Java 17.

# Stage 1: Build the Spring Boot JAR using Maven and Java 17.
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first so Docker can cache dependency downloads.
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source code and create the executable Spring Boot JAR.
COPY src ./src
RUN mvn -B clean package -DskipTests

# Stage 2: Run the JAR in a smaller Java 17 runtime image.
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the generated JAR from the build stage.
COPY --from=build /app/target/*.jar app.jar

# Spring Boot runs on port 8080 inside the container.
EXPOSE 8080

# Start the backend application.
ENTRYPOINT ["java", "-jar", "app.jar"]
