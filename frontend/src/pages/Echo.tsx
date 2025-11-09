import React, { useState } from "react";

export default function EchoPage() {
  const [msg, setMsg] = useState("");
  const [resp, setResp] = useState<string | null>(null);

  function send() {
    fetch(`/api/echo?msg=${encodeURIComponent(msg)}`)
      .then((r) => r.json())
      .then((data) => setResp(JSON.stringify(data)))
      .catch(() => setResp("error"));
  }

  return (
    <div>
      <h1>Echo</h1>
      <p>Type a message and the backend will echo it back.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="message" />
        <button onClick={send}>Send</button>
      </div>
      <pre style={{ marginTop: 12 }}>{resp ?? "(no response)"}</pre>
    </div>
  );
}
