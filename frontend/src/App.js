import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");

  // Use a ref to hold the stompClient instance
  const stompClientRef = useRef(null);

  useEffect(() => {
    // Disconnect when the component unmounts
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const connect = () => {
    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }

    // Pass username as query param for SockJS handshake
    const sockJsUrl = `https://localhost:8443/ws-chat?username=${encodeURIComponent(username)}`;
    const client = new Client({
      webSocketFactory: () => new SockJS(sockJsUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log(new Date(), str),
      // Remove connectHeaders: { username }, // not used for handshake
      onWebSocketClose: (event) => {
        console.warn("[FRONTEND] WebSocket closed:", event);
        setIsConnected(false);
      }
    });

    client.onConnect = () => {
      console.log("Connected as", username);
      setIsConnected(true);

      client.subscribe("/topic/users", (message) => {
        console.log("%c[USERS] Raw message received:", "color: orange;", message.body);
        try {
          const users = JSON.parse(message.body);
          console.log("%c[USERS] Parsed user array:", "color: green;", users);
          console.log("%c[USERS] Current client username:", "color: cyan;", username);

          if (Array.isArray(users)) {
            const filteredUsers = users.filter(user => user !== username);
            console.log("%c[USERS] Filtered user list to render:", "color: lightblue;", filteredUsers);
            setOnlineUsers(filteredUsers);
          } else {
            console.warn("[USERS] Received data is not an array:", users);
          }
        } catch (error) {
          console.error("[USERS] Could not parse user list:", error);
        }
      });

      client.subscribe(`/user/queue/messages`, (message) => {
        const msg = JSON.parse(message.body);
        console.log("[FRONTEND] Received message:", msg);
        setChatMessages((prev) => [...prev, msg]);
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    stompClientRef.current = client;
  };

  const sendMessage = () => {
    if (stompClientRef.current && to && content) {
      const msg = { from: username, to, content };
      console.log("[FRONTEND] Sending message:", msg);
      stompClientRef.current.publish({
        destination: "/app/private",
        body: JSON.stringify(msg),
      });
      setChatMessages((prev) => [...prev, msg]);
      setContent("");
    }
  };

  return (
    <div className="App">
      {!isConnected ? (
        <div className="center-screen name-box">
          <h2>Enter Username</h2>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            onKeyPress={(e) => e.key === 'Enter' && connect()}
          />
          <button onClick={connect}>Connect</button>
        </div>
      ) : (
        <div className="app-container">
          <div className="users-panel">
            <h3>Online Users</h3>
            <ul>
              {onlineUsers.map((user) => (
                <li key={user} onClick={() => setTo(user)} className={to === user ? 'active' : ''}>
                  {user}
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-panel">
            <h2>Welcome, {username}</h2>
            <div className="messages-box">
              <ul>
                {chatMessages.map((msg, idx) => (
                   <li key={idx} className={msg.from === username ? 'msg self' : 'msg other'}>
                      <b>{msg.from === username ? 'You' : msg.from} to {msg.to === username ? 'You' : msg.to}:</b> {msg.content}
                   </li>
                ))}
              </ul>
            </div>
            <div className="message-box input-box">
              <input
                placeholder="Recipient"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <input
                placeholder="Type your message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

