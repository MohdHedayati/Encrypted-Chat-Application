// Convert string to ArrayBuffer
export function stringToArrayBuffer(str) {
    return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to string
export function arrayBufferToString(buffer) {
    return new TextDecoder().decode(buffer);
}

// Convert ArrayBuffer to Base64 (for sending over network)
export function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Convert Base64 to ArrayBuffer (for receiving from network)
export function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

//RSA KEY GENERATION


 //Public key - extractable (can be exported and sent to server)
 //Private key - non-extractable (stays in IndexedDB, cannot be exported)

export async function generateRSAKeyPair() {
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,  // Key size
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,  // Public key is extractable
            ["encrypt", "decrypt"]  // Key usages
        );

        return keyPair;  // publicKey,privateKey
    } catch (error) {
        console.error("Error generating RSA key pair:", error);
        throw error;
    }
}

//
 //Export public key to JWK format (JSON) for sending to server
 //
export async function exportPublicKeyAsJWK(publicKey) {
    try {
        const jwk = await window.crypto.subtle.exportKey("jwk", publicKey);
        return JSON.stringify(jwk);  // Convert to string for storage
    } catch (error) {
        console.error("Error exporting public key:", error);
        throw error;
    }
}


 // Import public key from JWK format (received from server)

export async function importPublicKeyFromJWK(jwkData) {
    try {
        let jwk;
        if (typeof jwkData === 'string') {
            console.log("[IMPORT] Parsing JWK string...");
            jwk = JSON.parse(jwkData);
        } else if (typeof jwkData === 'object') {
            console.log("[IMPORT] JWK already parsed as object");
            jwk = jwkData;
        } else {
            throw new Error("Invalid JWK data type: " + typeof jwkData);
        }

        console.log("[IMPORT] JWK object:", jwk);
        const publicKey = await window.crypto.subtle.importKey(
            "jwk",
            jwk     ,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,  // Extractable
            ["encrypt"]  // Only for encryption
        );
        return publicKey;
    } catch (error) {
        console.error("Error importing public key:", error);
        throw error;
    }
}

// AES KEY GENERATION


 //Generate AES key for message encryption (per session)
 //Non-extractable -cannot be exported, only used for encryption,decryption

export async function generateAESKey() {
    try {
        const aesKey = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256  // 256-bit key
            },
            true,  // Extractable (needed to encrypt with RSA)
            ["encrypt", "decrypt"]
        );
        return aesKey;
    } catch (error) {
        console.error("Error generating AES key:", error);
        throw error;
    }
}

// MESSAGE ENCRYPTION

 //Encrypt message with AES
 // Returns: { ciphertext: base64, iv: base64 }

export async function encryptMessageWithAES(message, aesKey) {
    try {
        // Generate random IV
        const iv = window.crypto.getRandomValues(new Uint8Array(12));  // 12 bytes for GCM

        const messageBuffer = stringToArrayBuffer(message);

        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            aesKey,
            messageBuffer
        );

        return {
            ciphertext: arrayBufferToBase64(encryptedBuffer),
            iv: arrayBufferToBase64(iv)
        };
    } catch (error) {
        console.error("Error encrypting message:", error);
        throw error;
    }
}


 //Decrypt message with AES-GCM

export async function decryptMessageWithAES(ciphertextBase64, ivBase64, aesKey) {
    try {
        const ciphertext = base64ToArrayBuffer(ciphertextBase64);
        const iv = base64ToArrayBuffer(ivBase64);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            aesKey,
            ciphertext
        );

        return arrayBufferToString(decryptedBuffer);
    } catch (error) {
        console.error("Error decrypting message:", error);
        throw error;
    }
}

// aes key encryption with RSA


 //Wrap (encrypt) AES key with receiver's RSA public key
 //Returns: base64 encoded wrapped key

export async function wrapAESKeyWithRSA(aesKey, receiverPublicKey) {
    try {
        // Export AES key to raw format
        const aesKeyRaw = await window.crypto.subtle.exportKey("raw", aesKey);

        // Encrypt with RSA public key
        const wrappedKey = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            receiverPublicKey,
            aesKeyRaw
        );

        return arrayBufferToBase64(wrappedKey);
    } catch (error) {
        console.error("Error wrapping AES key:", error);
        throw error;
    }
}


 //Unwrap (decrypt) AES key with own RSA private key
 //Returns: CryptoKey (AES key)




export async function unwrapAESKeyWithRSA(wrappedKeyBase64, privateKey) {
    try {
        const wrappedKey = base64ToArrayBuffer(wrappedKeyBase64);

        //changed unwrap to decrypt meaning aes key will be encrypted and decrypted not wrapped and unwrapped
        const aesKeyRawBuffer = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            wrappedKey
        );

        // After decrypting,must import the raw buffer back into a CryptoKey object
        const aesKey = await window.crypto.subtle.importKey(
            "raw", // Format of the key to import
            aesKeyRawBuffer,
            {
                name: "AES-GCM",
                length: 256
            },
            true, // Extractable
            ["encrypt", "decrypt"]
        );

        return aesKey;
    } catch (error) {
        console.error("Error unwrapping AES key:", error);
        throw error;
    }
}