# Introduction to Spring Boot

Spring Boot is a **Java-based framework** used to build **standalone, production-grade web applications** with minimal configuration. It is built on top of the Spring Framework and simplifies things like:

- Creating REST APIs
- Connecting to databases
- Setting up security
- Building microservices

---

## Why Use Spring Boot?

- **No XML config**: Uses annotations instead
- **Auto Configuration**: Automatically sets up the app based on dependencies
- **Embedded Server**: Comes with Tomcat by default — no need to install separately
- **Production Ready**: Built-in monitoring, logging, and error handling

---

## Typical Spring Boot Project Structure

my-springboot-app/  
├── src/  
│ ├── main/  
│ │ ├── java/  
│ │ │ └── com/example/demo/  
│ │ │ ├── DemoApplication.java # Main class (with main method)  
│ │ │ └── controllers/ # Your REST controllers (API endpoints)  
│ │ │ └── services/ # Business logic  
│ │ │ └── models/ # Entity/data classes  
│ │ └── resources/  
│ │ ├── application.properties # Configuration file  
│ │ └── static/ # HTML, CSS, JS files (if frontend here)  
│ │ └── templates/ # Thymeleaf/HTML templates  
├── pom.xml # Project dependencies (Maven)  
└── target/ # Compiled output (generated)


---

## How to Create a Spring Boot App (Using Spring Initializr)

1. Go to [https://start.spring.io](https://start.spring.io)
2. Choose:
   - **Project**: Maven
   - **Language**: Java
   - **Spring Boot**: Latest stable version
   - **Group**: `com.example`
   - **Artifact**: `demo`
   - **Dependencies**:
     - Spring Web (for REST APIs)
     - Spring Boot DevTools (for live reload)
     - Spring Data JPA & H2 (for DB, optional)

3. Click **Generate**, unzip the folder, and open it in **IntelliJ IDEA** or **VS Code**

---

##  Main Class — `DemoApplication.java`

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // Tells Spring this is the main app class
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args); // Starts the app
    }
}
```

## Example REST Controller - `HelloController.java`

```
package com.example.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot!";
    }
}
```
- `@RestController`: This class handles web requests
- `@GetMapping("/hello")`: Listens for GET requests on `/hello`

## Configuration file - `application.properties`

```
server.port=8081
spring.application.name=demo-app
```
This config changes the server port and sets the app name

## Running the app

- In IntelliJ: Right click `DemoApplication.java` - Run
- In terminal:
```
./mvnw spring-boot:run     # On Linux/Mac
mvnw spring-boot:run       # On Windows
```
Then go to [http://localhost:8080/hello]