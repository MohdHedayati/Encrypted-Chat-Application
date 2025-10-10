# Use a base image with Java 17
FROM openjdk:17-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file into the container
# The JAR file is in the 'target' directory created by Maven
COPY target/*.jar app.jar

# Expose the port the app will run on
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]