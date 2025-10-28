import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";

export default function Polls({ role }) {
  const [polls, setPolls] = useState([]);
  const socket = useSocket('http://localhost:3000');

  useEffect(() => {
    if (socket) {
      socket.on('pollUpdate', (updatedPolls) => {
        setPolls(updatedPolls);
      });
    }
  }, [socket]);

  function createPoll(question, optionsText) {
    const id = Date.now().toString();
    const options = optionsText
      .split("\n")
      .map((t, i) => ({ id: `${id}_${i}`, text: t.trim(), votes: 0 }));
    const newPoll = { id, question, options, active: true };
    const updatedPolls = [newPoll, ...polls];
    setPolls(updatedPolls);
    socket.emit('pollUpdate', updatedPolls);
  }

  function vote(pollId, optionId) {
    const updatedPolls = polls.map((p) => {
      if (p.id !== pollId) return p;
      const updatedOptions = p.options.map((o) =>
        o.id === optionId ? { ...o, votes: o.votes + 1 } : o
      );
      return { ...p, options: updatedOptions };
    });
    setPolls(updatedPolls);
    socket.emit('pollUpdate', updatedPolls);
  }

  function closePoll(pollId) {
    const updatedPolls = polls.map((p) => (p.id === pollId ? { ...p, active: false } : p));
    setPolls(updatedPolls);
    socket.emit('pollUpdate', updatedPolls);
  }

  const PollCreator = () => {
    const [q, setQ] = useState("");
    const [opts, setOpts] = useState("Option 1\nOption 2");
    return (
      <div className="bg-white p-3 rounded shadow mb-2">
        <h4 className="font-semibold mb-2">Create Poll</h4>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Question"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-2"
          rows={3}
          value={opts}
          onChange={(e) => setOpts(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => {
            if (!q.trim()) return alert("Enter question");
            createPoll(q, opts);
            setQ("");
            setOpts("Option 1\nOption 2");
          }}
        >
          Publish Poll
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white p-3 rounded shadow">
      <h4 className="font-semibold mb-2">Polls</h4>
      {role === "teacher" && <PollCreator />}
      {polls.map((p) => (
        <div key={p.id} className="border p-2 rounded mb-2">
          <div className="flex justify-between">
            <div className="font-medium">{p.question}</div>
            <div className="text-xs text-gray-500">{p.active ? "Open" : "Closed"}</div>
          </div>
          {p.options.map((o) => (
            <div key={o.id} className="flex justify-between text-sm mt-1">
              <span>{o.text}</span>
              <span>
                {o.votes} votes{" "}
                {p.active && (
                  <button
                    className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs"
                    onClick={() => vote(p.id, o.id)}
                  >
                    Vote
                  </button>
                )}
              </span>
            </div>
          ))}
          {role === "teacher" && p.active && (
            <button
              className="px-2 py-1 bg-yellow-500 rounded mt-2 text-xs"
              onClick={() => closePoll(p.id)}
            >
              Close Poll
            </button>
          )}
        </div>
      ))}
      {polls.length === 0 && <div className="text-sm text-gray-500">No polls yet</div>}
    </div>
  );
}
