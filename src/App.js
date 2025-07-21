import React, { useState } from "react";
import axios from "axios";

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState("{}");
  const [response, setResponse] = useState(null);

  const sendRequest = async () => {
    let parsedHeaders = {
      "Content-Type": "application/json"
    };
    try {
      const res = await axios.post("http://localhost:5001/proxy", {
        method,
        url,
        headers: parsedHeaders,
        body,
      });
      setResponse(res.data);
    } catch (error) {
      console.log()
      setResponse({ error: error.message });
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Agent API Sender (Postman-like)</h2>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter API URL" />
      <textarea value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder='{"Content-Type":"application/json"}' />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Request Body (optional)" />
      <button onClick={sendRequest}>Send</button>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}

export default App;
