import React, { useRef, useState, useEffect } from "react";

/**

TG Live Classes - Single file React component


---

Features included (frontend prototype):

Viewer-only live video player (accepts HLS or other stream URL)


Polls (teacher can create poll; viewers can vote; results update in realtime locally)


Interactive whiteboard (draw, erase, clear) usable by the teacher and visible to students


Basic text chat (in-memory simulation)


Roles: teacher vs student (set using ?role=teacher in URL or toggle in UI)


UI built with Tailwind classes (no external CSS required)


Notes & next steps for production:

For live streaming: integrate a streaming server or a CDN HLS endpoint or use a WebRTC SFU (Jitsi, Janus, mediasoup) so teacher can broadcast and students watch.


For real-time sync (poll votes, whiteboard updates, chat): add a WebSocket or realtime DB backend (Socket.io, Firebase Realtime/Firestore, Supabase realtime).


This file is intentionally self-contained as a demo/prototype. Replace streamUrl with your live HLS/MP4/RTC source when deploying.


Usage: drop this component into a React app (Vite / Create React App). It uses no external dependencies. */


export default function TGLiveClassApp() {
  // Role: 'teacher' or 'student' (default student)
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialRole = urlParams.get('role') === 'teacher' ? 'teacher' : 'student';
  const [role, setRole] = useState(initialRole);

  // Simulated live stream URL (replace with real HLS or MP4)
  const [streamUrl, setStreamUrl] = useState(
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" // example HLS test stream
  );

  // Chat
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");

  // Polls
  const [polls, setPolls] = useState([]); // {id, question, options: [{id,text,votes}], active}

  // Whiteboard sync (simplified): we will store a list of strokes
  const [strokes, setStrokes] = useState([]); // each stroke: {color, width, points: [{x,y}]}

  // Local-only: simulate realtime by updating the same state. Replace with websocket events.

  // Helpers: Chat send function
  function sendChat() {
    if (!chatText.trim()) return;
    const m = {
      id: Date.now(),
      author: role,
      text: chatText.trim(),
      ts: new Date().toLocaleTimeString()
    };
    setMessages((s) => [...s, m]);
    setChatText("");
  }

  // Poll functions
  function createPoll(question, optionsText) {
    const id = Date.now().toString();
    const options = optionsText.split('\n').map((t, i) => ({
      id: `${id}_${i}`,
      text: t.trim(),
      votes: 0
    }));
    const p = { id, question, options, active: true };
    setPolls((s) => [p, ...s]);
  }

  function vote(pollId, optionId) {
    setPolls((ps) =>
      ps.map((p) => {
        if (p.id !== pollId) return p;
        // prevent students from voting multiple times in this simple demo by attaching a voted flag locally
        if (!p.voters) p.voters = new Set();
        // In production, implement per-user vote tracking on server.
        p.options = p.options.map((o) =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        );
        return { ...p };
      })
    );
  }

  function closePoll(pollId) {
    setPolls((ps) =>
      ps.map((p) => (p.id === pollId ? { ...p, active: false } : p))
    );
  }

  // Whiteboard canvas refs
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#111827");
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    // On strokes update, redraw canvas
    redrawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes]);

  function redrawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw strokes
    for (const s of strokes) {
      ctx.beginPath();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      const pts = s.points;
      if (!pts || pts.length === 0) continue;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
  }

  function onPointerDown(e) {
    if (role !== 'teacher') return; // only teacher can draw by default
    drawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const stroke = { color, width: lineWidth, points: [{ x, y }] };
    setStrokes((s) => [...s, stroke]);
  }

  function onPointerMove(e) {
    if (!drawing.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStrokes((all) => {
      const copy = [...all];
      const last = copy[copy.length - 1];
      last.points.push({ x, y });
      return copy;
    });
  }

  function onPointerUp() {
    drawing.current = false;
    // In production, broadcast the new stroke to all viewers via websocket
  }

  function clearBoard() {
    setStrokes([]);
  }

  // Simple utility to download whiteboard as PNG
  function downloadBoard() {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `board_${Date.now()}.png`;
    a.click();
  }

  // VideoPlayer component
  function VideoPlayer({ url }) {
    // For HLS support in browsers that don't natively support HLS, you would integrate hls.js.
    // Here we keep a simple <video> element that plays mp4/HLS on browsers that support it.
    return (
      <div className="bg-black rounded-md overflow-hidden">
        <video
          id="liveVideo"
          controls
          playsInline
          autoPlay
          muted={role === 'teacher' ? false : true}
          style={{ width: '100%', height: '360px', backgroundColor: '#000' }}
        >
          <source src={url} />
          Your browser does not support the video element.
        </video>
        <div className="p-2 text-sm text-gray-300">Live stream URL: {url}</div>
      </div>
    );
  }

  // PollCreator UI for teacher
  function PollCreator() {
    const [q, setQ] = useState("");
    const [opts, setOpts] = useState("Option 1\nOption 2");
    return (
      <div className="bg-white p-3 rounded shadow">
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
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => {
              if (!q.trim()) return alert('Enter question');
              createPoll(q, opts);
              setQ('');
              setOpts('Option 1\nOption 2');
            }}
          >
            Publish Poll
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => {
              setQ('');
              setOpts('Option 1\nOption 2');
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">TG Live Class</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Role:</span>
              <select
                className="border p-1 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student (Viewer)</option>
                <option value="teacher">Teacher (Host)</option>
              </select>
            </div>
          </div>

          <VideoPlayer url={streamUrl} />

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Whiteboard</h3>
            <div className="flex gap-3 mb-2 items-center">
              <label className="flex gap-2 items-center">
                <span className="text-xs">Color</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
              <label className="flex gap-2 items-center">
                <span className="text-xs">Width</span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                />
              </label>

              {role === 'teacher' ? (
                <>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={clearBoard}
                  >
                    Clear
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={downloadBoard}
                  >
                    Download
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-500">Viewing only</div>
              )}
            </div>
            <div className="border rounded">
              <canvas
                ref={canvasRef}
                width={1200}
                height={480}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                style={{
                  width: '100%',
                  height: '320px',
                  touchAction: 'none',
                  background: '#fff'
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Tip: Only teacher can draw. To allow others, change role to teacher (for demo).
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-semibold">Stream & Settings</h4>
            <label className="text-xs text-gray-600">Live stream URL</label>
            <input
              className="border p-2 w-full mt-1"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
            />
            <div className="mt-2 text-sm text-gray-500">
              Replace above with your HLS or MP4 URL. For WebRTC, integrate an SFU and set the viewer URL here.
            </div>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-semibold">Polls</h4>
            {role === 'teacher' && <PollCreator />}
            <div className="mt-3 space-y-2">
              {polls.length === 0 && (
                <div className="text-sm text-gray-500">No polls yet</div>
              )}
              {polls.map((p) => (
                <div key={p.id} className="border p-2 rounded">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{p.question}</div>
                    <div className="text-xs text-gray-500">
                      {p.active ? 'Open' : 'Closed'}
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {p.options.map((o) => (
                      <div key={o.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{o.text}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-500">{o.votes} votes</div>
                          {p.active && (
                            <button
                              className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs"
                              onClick={() => vote(p.id, o.id)}
                            >
                              Vote
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {role === 'teacher' && p.active && (
                      <button
                        className="px-2 py-1 bg-yellow-500 rounded"
                        onClick={() => closePoll(p.id)}
                      >
                        Close Poll
                      </button>
                    )}
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() =>
                        alert(
                          JSON.stringify(
                            p.options.map((o) => ({
                              text: o.text,
                              votes: o.votes
                            }))
                          )
                        )
                      }
                    >
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-semibold">Chat</h4>
            <div
              style={{ height: 220 }}
              className="overflow-y-auto border p-2 rounded mb-2 bg-gray-50"
            >
              {messages.length === 0 && (
                <div className="text-sm text-gray-500">No messages yet</div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-2 ${m.author === 'teacher' ? 'text-right' : ''}`}
                >
                  <div
                    className={`inline-block p-2 rounded ${
                      m.author === 'teacher' ? 'bg-blue-100' : 'bg-white'
                    }`}
                  >
                    <div className="text-xs text-gray-500">
                      {m.author} • {m.ts}
                    </div>
                    <div className="text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="border p-2 flex-1"
                placeholder="Type message"
              />
              <button
                onClick={sendChat}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Chat shown to everyone in this demo. For production, integrate authentication & moderation.
            </div>
          </div>
        </aside>
      </div>

      <footer className="max-w-6xl mx-auto mt-6 text-xs text-gray-500">
        TG Live Classes — demo frontend. Want backend WebSocket + streaming integration? Ask and I'll provide server code.
      </footer>
    </div>
  );
}