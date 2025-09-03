import React, { useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./App.css";

let stompClient = null;

function App() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");

  const connect = () => {
    stompClient = new Client({
      webSocketFactory: () => new SockJS("https://localhost:8443/ws-chat"),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      connectHeaders: { username }, // Send username as a header
    });

    stompClient.onConnect = () => {
      console.log("Connected as", username);
      setIsConnected(true);

      stompClient.subscribe("/topic/users", (res) => {
        let users = JSON.parse(res.body);
        if (!Array.isArray(users)) users = Array.from(users);
        setOnlineUsers(users);
      });

      stompClient.subscribe("/user/queue/messages", (res) => {
        const msg = JSON.parse(res.body);
        setChatMessages((prev) => [...prev, msg]);
      });

      // No need to send /app/register anymore
      // stompClient.publish({
      //   destination: "/app/register",
      //   body: username,
      // });
    };

    stompClient.activate();
  };

  const sendMessage = () => {
    if (stompClient && to && content) {
      const msg = { from: username, to, content };
      stompClient.publish({
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
          />
          <button onClick={connect}>Connect</button>
        </div>
      ) : (
        <div className="app-container">
          <div className="users-panel">
            <h3>Online Users</h3>
            <ul>
              {onlineUsers.map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </div>
          <div className="chat-panel">
            <h2>Welcome, {username}</h2>
            <div className="message-box input-box">
              <input
                placeholder="Recipient"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <input
                placeholder="Message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            <div className="messages-box">
              <ul>
                {chatMessages.map((msg, idx) => (
                  <li key={idx}>
                    <b>{msg.from} → {msg.to}:</b> {msg.content}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
