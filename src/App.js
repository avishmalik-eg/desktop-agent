import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState('{ "Content-Type": "application/json" }');
  const [response, setResponse] = useState(null);
  const [agentUpdates, setAgentUpdates] = useState([]);

  const sendRequest = async () => {
    let parsedHeaders = {};
    let parsedBody = body;

    try {
      parsedHeaders = JSON.parse(headers || "{}");
      if (parsedHeaders["Content-Type"] === "application/json" && body.trim()) {
        parsedBody = JSON.parse(body);
      }
    } catch (err) {
      setResponse({ error: "Invalid JSON in headers or body." });
      return;
    }

    try {
      const res = await axios.post("https://localhost:5001/proxy", {
        method,
        url,
        headers: parsedHeaders,
        body: parsedBody,
      });
      setResponse(res.data);
    } catch (error) {
      setResponse({ error: error.message });
    }
  };

  useEffect(() => {
    const socket = new WebSocket("wss://localhost:5001/ws");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const msg = event.data;
      console.log("Agent update:", msg);
      setAgentUpdates((prev) => [...prev, msg]);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close();
  }, []);

  return (
    <div style={{ padding: "1rem", fontFamily: "monospace" }}>
      <h2>🛰️ Agent API Tester</h2>
      <div>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter full API URL"
          style={{ width: "70%", marginLeft: "10px" }}
        />
      </div>

      <textarea
        rows={4}
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        placeholder='Headers: {"Content-Type":"application/json"}'
        style={{ width: "100%", marginTop: "10px" }}
      />
      <textarea
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body (JSON only)"
        style={{ width: "100%", marginTop: "10px" }}
      />
      <button onClick={sendRequest} style={{ marginTop: "10px" }}>
        🚀 Send
      </button>

      <h3>📬 Response</h3>
      <pre>{JSON.stringify(response, null, 2)}</pre>

      <h3>🧠 Agent Updates</h3>
      <ul>
        {agentUpdates.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
