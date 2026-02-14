# Cryptify
<p align="center">
  <img src="logo.png" alt="Cryptify Logo" width="150"/>
  <br>
  <b>Cryptify</b>
</p>

[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6db33f.svg)](https://spring.io/projects/spring-boot)

> **Chat securely, instantly.** Real-time encrypted chat built with Spring Boot, React, and WebSockets using RSA + AES hybrid encryption.

Cryptify is a secure messaging platform that ensures end-to-end privacy through client-side encryption. Messages are encrypted before transmission, sent over WebSockets, and decrypted only by the intended recipient—the server never sees the plain text.

**[View Full Documentation](https://mohdhedayati.github.io/Encrypted-Chat-Application/)**

---

## Features

- **End-to-End Encryption**: Hybrid encryption combining RSA (key exchange) and AES (message encryption)
- **Real-Time Messaging**: Instant message delivery powered by WebSockets
- **Secure Authentication**: User authentication with Spring Security
- **Private Conversations**: One-on-one encrypted chats
- **Transport Layer Security**: TLS/SSL encryption for data in transit

---

## Architecture

Cryptify follows a client-server architecture with clear separation of concerns:

- **Frontend**: React-based SPA handling UI, client-side encryption, and WebSocket connections
- **Backend**: Spring Boot server managing authentication, message routing, and WebSocket endpoints
- **Communication**: Real-time bidirectional communication via WebSockets (STOMP protocol)
- **Security**: Multi-layered approach with hybrid encryption and TLS/SSL

### Security Model

1. **Hybrid Encryption (RSA + AES)**:
   - RSA-2048 for secure key exchange
   - AES-256-GCM for efficient message encryption
   - Each session generates unique encryption keys

2. **Transport Layer Security**:
   - TLS/SSL for all client-server communication
   - Protection against man-in-the-middle attacks

---

## Tech Stack

### Frontend
- **Framework**: React 18.x
- **WebSocket Client**: STOMP.js, SockJS
- **Cryptography**: Web Crypto API
- **Testing**: Jest, React Testing Library
- **Build Tool**: React Scripts

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security
- **WebSocket**: Spring WebSocket with STOMP
- **Language**: Java

### Deployment
- **Frontend**: Vercel
- **Backend**: Render

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) and npm
- **Java Development Kit (JDK)** (v17 or higher)
- **Maven** or **Gradle** (for backend build)
- A code editor (VS Code, IntelliJ IDEA, etc.)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/mohdhedayati/Encrypted-Chat-Application.git
cd Encrypted-Chat-Application
```

#### 2. Backend Setup

```bash
cd chat-server

# Install dependencies and build
./mvnw clean install

# Run the Spring Boot application
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080` by default.

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open in your browser at `http://localhost:3000`.

### Configuration

#### Backend Configuration

Edit `chat-server/src/main/resources/application.properties`:

```properties
server.port=8080
spring.websocket.allowed-origins=http://localhost:3000
```

#### Frontend Configuration

Update WebSocket connection settings in `frontend/src/config.js` (if applicable):

```javascript
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';
```

---

## Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Start Chatting**: Select a contact to begin a private encrypted conversation
3. **Send Messages**: Type your message and hit send—encryption happens automatically
4. **Secure Communication**: All messages are encrypted end-to-end; only you and your recipient can read them

---

## Team

### Developers
- **[Rudrakshi Chincholkar](https://github.com/RudrakshiChincholkar)**
- **[Mohammed Hedayati](https://github.com/MohdHedayati)**

### Mentors
- **[Rupak Gupta](https://github.com/aitwehrrg)**
- **[Tanish Bhamare](https://github.com/Tanish2207)**

---

## Documentation

For comprehensive documentation including architecture details, API reference, and security implementation:

**[Read the Full Documentation](https://mohdhedayati.github.io/Encrypted-Chat-Application/)**

Documentation covers:
- Detailed architecture overview
- Component interaction diagrams
- API endpoints and usage
- Cryptography implementation details
- Deployment guides
