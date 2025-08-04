import React, { useState, useEffect } from 'react';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/chat');
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

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
    <div style={{ padding: '20px' }}>
      {!isNameSet ? (
        <form onSubmit={handleNameSubmit}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <button type="submit">Join Chat</button>
        </form>
      ) : (
        <>
          <div style={{ height: '300px', overflowY: 'auto', border: '1px solid gray', padding: '10px' }}>
            {messages.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
            placeholder="Type your message"
            style={{ width: '80%' }}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
