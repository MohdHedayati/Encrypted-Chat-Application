const DB_NAME = "ChatAppCrypto";
const DB_VERSION = 1;
const KEYS_STORE = "keys";

// Open IndexedDB connection
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create object store for keys if it doesn't exist
            if (!db.objectStoreNames.contains(KEYS_STORE)) {
                db.createObjectStore(KEYS_STORE, { keyPath: "id" });
            }
        };
    });
}

// Store RSA private key (CryptoKey objects can be stored directly)
export async function storePrivateKey(privateKey) {
    try {
        const db = await openDB();
        const transaction = db.transaction([KEYS_STORE], "readwrite");
        const store = transaction.objectStore(KEYS_STORE);

        return new Promise((resolve, reject) => {
            const request = store.put({ id: "rsa_private_key", key: privateKey });
            request.onsuccess = () => {
                console.log("Private key stored in IndexedDB");
                resolve();
            };
            request.onerror = () => {
                console.error("Error storing private key:", request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Error storing private key:", error);
        throw error;
    }
}

// Get RSA private key from IndexedDB
export async function getPrivateKey() {
    try {
        const db = await openDB();
        const transaction = db.transaction([KEYS_STORE], "readonly");
        const store = transaction.objectStore(KEYS_STORE);

        return new Promise((resolve, reject) => {
            const request = store.get("rsa_private_key");
            request.onsuccess = () => {
                if (request.result) {
                    console.log("Private key retrieved from IndexedDB");
                    resolve(request.result.key);
                } else {
                    console.warn("No private key found in IndexedDB");
                    resolve(null);
                }
            };
            request.onerror = () => {
                console.error("Error retrieving private key:", request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Error retrieving private key:", error);
        throw error;
    }
}

// Store AES session key for a specific user,export to raw format first
export async function storeSessionKey(username, aesKey) {
    try {
        // Export the AES key to raw format for storage
        const exportedKey = await window.crypto.subtle.exportKey("raw", aesKey);

        const db = await openDB();
        const transaction = db.transaction([KEYS_STORE], "readwrite");
        const store = transaction.objectStore(KEYS_STORE);

        return new Promise((resolve, reject) => {
            const request = store.put({
                id: `aes_session_${username}`,
                key: exportedKey,
                timestamp: Date.now() // Add timestamp for debugging
            });
            request.onsuccess = () => {
                console.log(`✅ AES session key stored for ${username}`);
                resolve();
            };
            request.onerror = () => {
                console.error(`❌ Error storing AES key for ${username}:`, request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Error storing session key:", error);
        throw error;
    }
}

// Get AES session key for a particular user ,import from raw format
export async function getSessionKey(username) {
    try {
        const db = await openDB();
        const transaction = db.transaction([KEYS_STORE], "readonly");
        const store = transaction.objectStore(KEYS_STORE);

        return new Promise((resolve, reject) => {
            const request = store.get(`aes_session_${username}`);
            request.onsuccess = async () => {
                if (request.result) {
                    try {
                        // Import the raw key back to CryptoKey format
                        const aesKey = await window.crypto.subtle.importKey(
                            "raw",
                            request.result.key,
                            {
                                name: "AES-GCM",
                                length: 256
                            },
                            true,
                            ["encrypt", "decrypt"]
                        );
                        console.log(`✅ AES session key retrieved for ${username}`);
                        resolve(aesKey);
                    } catch (importError) {
                        console.error(`Error importing AES key for ${username}:`, importError);
                        resolve(null);
                    }
                } else {
                    console.log(`No AES session key found for ${username}`);
                    resolve(null);
                }
            };
            request.onerror = () => {
                console.error(`Error retrieving AES key for ${username}:`, request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Error retrieving session key:", error);
        throw error;
    }
}

// Clear all keys (useful for logout)
export async function clearAllKeys() {
    try {
        const db = await openDB();
        const transaction = db.transaction([KEYS_STORE], "readwrite");
        const store = transaction.objectStore(KEYS_STORE);

        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => {
                console.log(" All keys cleared from IndexedDB");
                resolve();
            };
            request.onerror = () => {
                console.error("❌ Error clearing keys:", request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Error clearing keys:", error);
        throw error;
    }
}

// Debug function to list all stored keys
export async function debugListAllKeys() {
    try {
        const db = await openDB();
        const transaction = db.transaction([KEYS_STORE], "readonly");
        const store = transaction.objectStore(KEYS_STORE);

        return new Promise((resolve, reject) => {
            const request = store.getAllKeys();
            request.onsuccess = () => {
                console.log("All stored keys:", request.result);
                resolve(request.result);
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error("Error listing keys:", error);
        throw error;
    }
}