# Project Overview

## Introduction

This document provides a technical overview of the Secure Chat Application, a real-time messaging platform designed with a primary focus on security and privacy. The application ensures that all communications are confidential and secure through a robust, multi-layered encryption strategy.

The project is built using a modern technology stack, with **React** for the frontend client and **Spring Boot** for the backend server. Real-time, bidirectional communication is achieved using **WebSockets**.

---

## Core Technologies

* **Frontend:** React
* **Backend:** Spring Boot
* **Real-Time Communication:** WebSockets
* **Security:**
    * Hybrid Encryption (RSA + AES) for End-to-End Encryption
    * TLS/SSL for Transport Layer Security

---

## Key Features

### 1. End-to-End Encryption (E2EE)

The application's core security feature is its implementation of End-to-End Encryption. This ensures that a message is encrypted on the sender's device and can only be decrypted by the intended recipient's device. The server, or any potential eavesdropper, cannot read the message content.



### 2. Hybrid Encryption Model

To achieve robust and efficient E2EE, the application uses a hybrid encryption model that combines the strengths of both asymmetric (RSA) and symmetric (AES) cryptography.

* **RSA (Asymmetric Encryption):** Used to securely exchange symmetric keys between users. Each user has a public/private key pair. The public key is used to encrypt a one-time session key, which can only be decrypted by the recipient's corresponding private key.
* **AES (Symmetric Encryption):** Used for the actual encryption of messages. AES is much faster than RSA for encrypting large amounts of data. A new, unique AES session key is generated for each conversation, exchanged securely using RSA, and then used to encrypt all messages within that session.

### 3. Transport Layer Security (TLS)

In addition to E2EE for message content, all communication between the client and the server is wrapped in a **TLS (Transport Layer Security)** tunnel. This encrypts the entire data stream, protecting message metadata and preventing man-in-the-middle (MITM) attacks between the client and the server.

### 4. Real-Time Communication

The use of **WebSockets** provides a persistent, full-duplex communication channel between the client and the server. This allows for the instantaneous delivery of messages and presence status updates (e.g., typing indicators) without the overhead of traditional HTTP polling, creating a seamless and responsive user experience.