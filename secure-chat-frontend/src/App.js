import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);

  const messageEndRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/chat');
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket && input.trim() !== '') {
      socket.send(`${name}: ${input}`);
      setInput('');
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== '') {
      setIsNameSet(true);
    }
  };

  return (
    <div className="app-container">
      {!isNameSet ? (
        <form className="name-form" onSubmit={handleNameSubmit}>
          <h2>Enter Your Name</h2>
          <input
            className="name-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
          <button type="submit" className="join-button">Join Chat</button>
        </form>
      ) : (
        <div className="chat-wrapper">
          <header className="chat-header">Secure Chat</header>
          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div key={idx} className="chat-message">{msg}</div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <div className="input-area">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
              placeholder="Type your message..."
            />
            <button className="send-button" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
