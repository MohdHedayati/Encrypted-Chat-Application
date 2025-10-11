## What is Cryptography

**Cryptography** is the practice and study of techniques for secure communication in the presence of adversarial behaviour. It involves transforming readable data (plain text) into an unreadable format (cipher text) and back again

Our Chat App focuses on user's Privacy and confidentiality of Data, for that we use Two Cryptography Algorithms. 
- RSA (Rivest-Shamir-Adleman)
- AES (Advance Encryption Standard)

## Need for Cryptography 

In a chat application, cryptography is essential to guarantee:

- **Confidentiality**
	- Messages are kept secret. Only the intended recipient can read the content, even if a third party (like the server or an attacker) intercepts the data.
- **Integrity**
	- Ensures the message hasn't been altered during transmission.
- **Authentication**
	- Verifies that the sender is who they claim to be.


## Implementation 

#### 1. [[RSA]]
- Rivest-Shamir-Adleman (RSA) Algorithm is an **** asymmetric*** or **** public-key cryptography**** algorithm which means it works with two different keys: **** Public Key*** and **** Private Key***.

#### 2. [[AES]] 
- Advanced Encryption Standard (AES) is an **symmetric** **cryptography***  algorithm used to secure data using a single key for both Encryption and Decryption.


## Web Crypto API 
- There are several libraries and frameworks available in **Java** for implementing cryptography, such as the **Java Cryptography Architecture (JCA)**, which provides high-level APIs that abstract the low-level details of algorithms like **AES** and **RSA**.  
- For **client-side encryption**, common options include **CryptoJS** (a JavaScript library) and the **Web Crypto API**.
- For enhanced security, we chose to implement **client-side key generation**, as it enables true **End-to-End Encryption (E2EE)** — ensuring that private keys never leave the user’s device. The **Web Crypto API** supports this approach by providing native, secure methods for **AES** and **RSA** key generation, encryption, and decryption directly within the browser.

### After understanding the Algorithms that we will be using, let's Jump to it's implementation using Web Crypto API.

[[Hybrid Encryption]] 

