import { fetchConversationHistory } from './api/messageApi';
import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Login from "./Login";
import Register from "./Register";
import "./App.css";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [to, setTo] = useState("");
    const [content, setContent] = useState("");
    const [view, setView] = useState("login"); // 'login' or 'register'
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);    const stompClientRef = useRef(null);

    useEffect(() => {
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    const handleLoginSuccess = (user) => {
        setUsername(user);
        setIsAuthenticated(true);
        connectToWebSocket(user);
    };

    const handleRegisterSuccess = () => {
        setView("login");
    };

    const connectToWebSocket = (user) => {
        const sockJsUrl = `https://localhost:8443/ws-chat`;

        const client = new Client({
            webSocketFactory: () => new SockJS(sockJsUrl),
            reconnectDelay: 5000,
            debug: (str) => console.log(new Date(), str),
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

            client.subscribe(`/user/queue/messages`, (message) => {
                const msg = JSON.parse(message.body);
                setChatMessages((prev) => [...prev, msg]);
            });
        };

        client.onStompError = (frame) => {
            console.error("Broker error:", frame.headers["message"]);
            console.error("Details:", frame.body);
        };

        client.activate();
        stompClientRef.current = client;
    };

    const sendMessage = () => {
        if (stompClientRef.current && to && content) {
            const msg = { from: username, to, content };
            stompClientRef.current.publish({
                destination: "/app/private",
                body: JSON.stringify(msg),
            });
            // setChatMessages((prev) => [...prev, msg]);  frontend mai double appending cause of this
            setContent("");
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

    /**
     * Loads previous messages when user selects someone to chat with
     * @param {string} selectedUser - Username of the person to chat with
     */
    const loadConversationHistory = async (selectedUser) => {
        if (!selectedUser) return;

        setIsLoadingMessages(true);

        try {
            console.log(`Loading conversation history with ${selectedUser}...`);

            // Fetch messages from backend
            const messages = await fetchConversationHistory(selectedUser);

            console.log(`Loaded ${messages.length} previous messages`);

            // Add these messages to chatMessages state
            // We use a Set to avoid duplicates if messages are already loaded
            setChatMessages(prevMessages => {
                // Create a map of existing messages by ID to avoid duplicates
                const existingIds = new Set(prevMessages.map(msg => msg.id));

                // Filter out messages that are already in state
                const newMessages = messages.filter(msg => !existingIds.has(msg.id));

                // Combine old and new messages, then sort by timestamp
                const combined = [...prevMessages, ...newMessages];

                // Sort by timestamp to maintain chronological order
                return combined.sort((a, b) =>
                    new Date(a.timestamp) - new Date(b.timestamp)
                );
            });

        } catch (error) {
            console.error('Failed to load conversation history:', error);
            // You might want to show an error message to user here
        } finally {
            setIsLoadingMessages(false);
        }
    };
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
                                onClick={() => {
                                    setChatMessages([]);
                                    setTo(user);
                                    loadConversationHistory(user);
                                }}
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
                        </div>
                    ) : (
                        <>
                            <h2>Chatting with {to}</h2>
                            <div className="messages-box">
                                {isLoadingMessages ? (
                                    <div className="loading-indicator">
                                        <p>Loading messages...</p>
                                    </div>
                                ) : (
                                    <ul>
                                        {chatMessages
                                            .filter(
                                                (msg) =>
                                                    (msg.from === username && msg.to === to) ||
                                                    (msg.from === to && msg.to === username)
                                            )
                                            .map((msg, idx) => (
                                                <li
                                                    key={msg.id || idx}  // Use msg.id if available
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
                                )}
                            </div>
                            <div className="message-box input-box">
                                <input
                                    placeholder="Type your message..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;