# --- Stage 1: Build the application ---
# Use a Maven image to build the project
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy the source code
COPY . .
# Run the Maven package command to build the JAR
RUN mvn clean package -DskipTests

# --- Stage 2: Create the final, lightweight image ---
# Use a slim Java image for the final container
FROM openjdk:17-slim
WORKDIR /app
# Copy only the built JAR from the 'build' stage
COPY --from=build /app/target/*.jar app.jar
# Expose the port the app will run on
EXPOSE 8080
# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]