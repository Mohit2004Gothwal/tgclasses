import React, { useState } from "react";

export default function ChatBox({ role }) {
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");

  function sendChat() {
    if (!chatText.trim()) return;
    const msg = {
      id: Date.now(),
      author: role,
      text: chatText.trim(),
      ts: new Date().toLocaleTimeString(),
    };
    setMessages((s) => [...s, msg]);
    setChatText("");
  }

  return (
    <div className="bg-white p-3 rounded shadow">
      <h4 className="font-semibold">Chat</h4>
      <div className="border p-2 rounded h-56 overflow-y-auto bg-gray-50 mb-2">
        {messages.map((m) => (
          <div key={m.id} className={`mb-2 ${m.author === "teacher" ? "text-right" : ""}`}>
            <div
              className={`inline-block p-2 rounded ${
                m.author === "teacher" ? "bg-blue-100" : "bg-white"
              }`}
            >
              <div className="text-xs text-gray-500">
                {m.author} • {m.ts}
              </div>
              <div className="text-sm">{m.text}</div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">No messages yet</div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Type message"
        />
        <button onClick={sendChat} className="bg-green-600 text-white px-3 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
