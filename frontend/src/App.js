import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

import {
    generateAESKey,
    encryptMessageWithAES,
    decryptMessageWithAES,
    wrapAESKeyWithRSA,
    unwrapAESKeyWithRSA,
    importPublicKeyFromJWK
} from "./utils/cryptoUtils";

import {
    getPrivateKey,
    getSessionKey,
    storeSessionKey
} from "./utils/indexedDBManager";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [to, setTo] = useState("");
    const [content, setContent] = useState("");
    const [view, setView] = useState("login"); // 'login' or 'register'

    const stompClientRef = useRef(null);
    const privateKeyRef = useRef(null);
    const sessionKeysRef = useRef({});

    useEffect(() => {
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    const handleLoginSuccess = async (user) => {
        setUsername(user);
        setIsAuthenticated(true);

        // Load private key from IndexedDB
        try {
            const privateKey = await getPrivateKey();
            if (!privateKey) {
                alert("Private key not found! Please register again.");
                return;
            }
            privateKeyRef.current = privateKey;
            console.log(" Private key loaded from IndexedDB");

            connectToWebSocket(user);
        } catch (error) {
            console.error("Error loading private key:", error);
            alert("Error loading encryption keys. Please register again.");
        }
    };

    const handleRegisterSuccess = () => {
        setView("login");
    };

    const connectToWebSocket = (user) => {
        const sockJsUrl = `https://localhost:8443/ws-chat`;

        const client = new Client({
            webSocketFactory: () => new SockJS(sockJsUrl, null, {
                transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
                timeout: 10000,
                withCredentials: true  // Send cookies
            }),
            reconnectDelay: 5000,
            debug: (str) => console.log(new Date(), str),

            onWebSocketError: (error) => {
                console.error("[WS ERROR]", error);
                alert("WebSocket connection failed. Please log in again.");
                setIsAuthenticated(false);
            },

            onWebSocketClose: (event) => {
                console.warn("[FRONTEND] WebSocket closed:", event);
                setIsConnected(false);
            }
        });

        client.onConnect = () => {
            console.log("Connected as", user);
            setIsConnected(true);

            client.subscribe("/topic/users", (message) => {
                try {
                    const users = JSON.parse(message.body);
                    if (Array.isArray(users)) {
                        const filteredUsers = users.filter(u => u !== user);
                        setOnlineUsers(filteredUsers);
                    }
                } catch (error) {
                    console.error("[USERS] Could not parse user list:", error);
                }
            });

            client.subscribe(`/user/queue/messages`, async (message) => {
                try {
                    const encryptedMsg = JSON.parse(message.body);
                    console.log("[ENCRYPTED MESSAGE RECEIVED]", encryptedMsg);

                    //  Decrypt the message
                    const decryptedContent = await decryptMessage(
                        encryptedMsg.encryptedContent,
                        encryptedMsg.encryptedAESKey,
                        encryptedMsg.iv,
                        encryptedMsg.from
                    );

                    // Add decrypted message to chat
                    setChatMessages((prev) => [...prev, {
                        from: encryptedMsg.from,
                        to: encryptedMsg.to,
                        content: decryptedContent  // Store plaintext locally
                    }]);
                } catch (error) {
                    console.error("[ERROR] Failed to decrypt message:", error);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("Broker error:", frame.headers["message"]);
            console.error("Details:", frame.body);
        };

        client.activate();
        stompClientRef.current = client;
    };

    //decrypt incoming message
    // Fixed decrypt incoming message function
    const decryptMessage = async (encryptedContent, encryptedAESKey, iv, senderUsername) => {
        try {
            // Check memory cache first
            let aesKey = sessionKeysRef.current[senderUsername];

            if (!aesKey) {
                // Check IndexedDB for existing session key
                console.log(`[DECRYPT] Checking IndexedDB for existing key from ${senderUsername}...`);
                aesKey = await getSessionKey(senderUsername);

                if (aesKey) {
                    console.log(`✅ Found existing AES key in IndexedDB for ${senderUsername}`);
                    sessionKeysRef.current[senderUsername] = aesKey; // Cache it in memory
                }
            }

            // If we still don't have a key, this must be the first message from this sender
            // We need to unwrap the AES key they sent us
            if (!aesKey) {
                console.log(`[DECRYPT] First message from ${senderUsername}, unwrapping AES key...`);

                if (!encryptedAESKey) {
                    throw new Error("No encrypted AES key provided for first message");
                }

                // Unwrap (decrypt) the AES key using our private RSA key
                aesKey = await unwrapAESKeyWithRSA(encryptedAESKey, privateKeyRef.current);

                // Store this key for future messages from this sender
                sessionKeysRef.current[senderUsername] = aesKey;
                await storeSessionKey(senderUsername, aesKey);
                console.log(`✅ AES session key unwrapped and stored for ${senderUsername}`);
            }

            // Decrypt the message content with the AES key
            const plaintext = await decryptMessageWithAES(encryptedContent, iv, aesKey);
            console.log(`✅ Message decrypted from ${senderUsername}`);

            return plaintext;
        } catch (error) {
            console.error("[DECRYPT ERROR]", error);
            console.error("Debug info:", {
                senderUsername,
                hasEncryptedAESKey: !!encryptedAESKey,
                hasPrivateKey: !!privateKeyRef.current,
                memoryKeys: Object.keys(sessionKeysRef.current)
            });
            return "[Failed to decrypt message]";
        }
    };
// encrypt and send message

        // Fixed encrypt and send message function
    const sendMessage = async () => {
            if (!to) {
                alert("Please select a recipient");
                return;
            }

            if (!onlineUsers.includes(to)) {
                alert(`${to} is offline. Cannot send message in real-time mode.`);
                return;
            }

            if (!stompClientRef.current || !content.trim()) {
                return;
            }

            try {
                // Check for existing AES key for this recipient
                let aesKey = sessionKeysRef.current[to];
                let isNewSession = false;

                if (!aesKey) {
                    // Check IndexedDB
                    console.log(`[ENCRYPT] Checking IndexedDB for existing key for ${to}...`);
                    aesKey = await getSessionKey(to);

                    if (aesKey) {
                        console.log(`✅ Found existing AES key in IndexedDB for ${to}`);
                        sessionKeysRef.current[to] = aesKey; // Cache it
                    } else {
                        // Generate new AES key for this conversation
                        console.log(`[ENCRYPT] Generating new AES key for ${to}...`);
                        aesKey = await generateAESKey();
                        isNewSession = true;

                        // Store immediately
                        sessionKeysRef.current[to] = aesKey;
                        await storeSessionKey(to, aesKey);
                        console.log(`✅ New AES session key generated and stored for ${to}`);
                    }
                } else {
                    console.log(`[ENCRYPT] Using cached AES key for ${to}`);
                }

                // Fetch receiver's public key
                console.log(`[ENCRYPT] Fetching public key for ${to}...`);
                const response = await fetch(`https://localhost:8443/api/keys/${to}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch receiver's public key");
                }

                const data = await response.json();
                const receiverPublicKey = await importPublicKeyFromJWK(data.publicKey);
                console.log(`✅ Public key fetched and imported for ${to}`);

                // ALWAYS wrap the AES key for the first message or if it's a new session
                // The receiver needs this to establish the session
                let wrappedAESKey = null;
                if (isNewSession || !sessionKeysRef.current[`sentInitialKey_${to}`]) {
                    wrappedAESKey = await wrapAESKeyWithRSA(aesKey, receiverPublicKey);
                    sessionKeysRef.current[`sentInitialKey_${to}`] = true;
                    console.log("✅ AES key wrapped with receiver's public key");
                } else {
                    console.log("Using established session, not sending AES key");
                }

                // Encrypt the message with AES
                const { ciphertext, iv } = await encryptMessageWithAES(content, aesKey);
                console.log("✅ Message encrypted");

                // Send encrypted data to server
                const encryptedMsg = {
                    from: username,
                    to: to,
                    encryptedContent: ciphertext,
                    encryptedAESKey: wrappedAESKey, // null if using established session
                    iv: iv
                };

                stompClientRef.current.publish({
                    destination: "/app/private",
                    body: JSON.stringify(encryptedMsg),
                });

                console.log("[SENT] Encrypted message sent to server", {
                    hasAESKey: !!wrappedAESKey,
                    recipient: to
                });

                // Add to local chat display
                setChatMessages((prev) => [...prev, {
                    from: username,
                    to: to,
                    content: content
                }]);

                setContent("");
            } catch (error) {
                console.error("[SEND ERROR]", error);
                alert("Failed to send encrypted message: " + error.message);
            }
        };
    // Show login/register if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="App">
                <div className="center-screen">
                    {view === "login" ? (
                        <Login
                            onLoginSuccess={handleLoginSuccess}
                            onSwitchToRegister={() => setView("register")}
                        />
                    ) : (
                        <Register
                            onRegisterSuccess={handleRegisterSuccess}
                            onSwitchToLogin={() => setView("login")}
                        />
                    )}
                </div>
            </div>
        );
    }

    // Show chat interface if authenticated
    return (
        <div className="App">
            <div className="app-container">
                <div className="users-panel">
                    <h3>Online Users</h3>
                    <ul>
                        {onlineUsers.map((user) => (
                            <li
                                key={user}
                                onClick={() => setTo(user)}
                                className={to === user ? "active" : ""}
                            >
                                {user}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`chat-panel ${!to ? "empty-chat" : ""}`}>
                    {!to ? (
                        <div className="placeholder">
                            <h2>Welcome, {username}</h2>
                            <p>Select a user to start chatting</p>
                            <p style={{fontSize: '0.9em', color: '#888', marginTop: '20px'}}>
                                🔒 End-to-End Encrypted
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2>Chatting with {to} 🔒</h2>
                            <div className="messages-box">
                                <ul>
                                    {chatMessages
                                        .filter(
                                            (msg) =>
                                                (msg.from === username && msg.to === to) ||
                                                (msg.from === to && msg.to === username)
                                        )
                                        .map((msg, idx) => (
                                            <li
                                                key={idx}
                                                className={
                                                    msg.from === username ? "msg self" : "msg other"
                                                }
                                            >
                                                <b>
                                                    {msg.from === username ? "You" : msg.from}:
                                                </b>{" "}
                                                {msg.content}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="message-box input-box">
                                <input
                                    placeholder="Type your message..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <button onClick={sendMessage}>Send 🔒</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;