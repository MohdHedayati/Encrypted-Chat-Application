import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]); // {id, text, from: 'me'|'them'}
  const [input, setInput] = useState("");
  const wsRef = useRef(null);
  const chatBoxRef = useRef(null);
  const idRef = useRef(0);

  useEffect(() => {
    // open websocket
    const ws = new WebSocket("ws://localhost:8080/chat");
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      console.log("✅ Connected to WebSocket");
    });

    ws.addEventListener("message", (ev) => {
      const raw = ev.data?.toString() ?? "";
      // Many server variants prefix with "📩 " or "Server:" etc — normalize:
      let text = raw;
      if (raw.startsWith("📩 ")) text = raw.substring(2);
      if (raw.startsWith("Server: ")) text = raw.substring("Server: ".length);
      if (raw.startsWith("Echo: ")) text = raw; // keep Echo prefix if present

      pushMessage(text, "them");
    });

    ws.addEventListener("close", () => {
      console.log("❌ WebSocket closed");
    });

    ws.addEventListener("error", (e) => {
      console.error("WebSocket error", e);
    });

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-scroll on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  function pushMessage(text, from = "them") {
    const id = idRef.current++;
    setMessages((m) => [...m, { id, text, from }]);
  }

  function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // send through websocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(trimmed);
      pushMessage(trimmed, "me");
      setInput("");
    } else {
      // show locally if not connected
      pushMessage("[Not connected] " + trimmed, "me");
    }
  }

  return (
    <div className="App">
      <div className="chat-container" role="main">
        <h2>Secure Chat Demo</h2>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message ${m.from === "me" ? "client" : "server"}`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
