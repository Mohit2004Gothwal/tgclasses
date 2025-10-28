import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import Whiteboard from "./components/Whiteboard";
import Polls from "./components/Polls";
import ChatBox from "./components/ChatBox";

export default function App() {
  // Role: teacher or student
  const urlParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const initialRole =
    urlParams.get("role") === "teacher" ? "teacher" : "student";
  const [role, setRole] = useState(initialRole);
  const [streamUrl, setStreamUrl] = useState(
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">TG Live Classes</h1>
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

          <VideoPlayer url={streamUrl} role={role} />
          <Whiteboard role={role} />
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
              Replace with your HLS / WebRTC source.
            </div>
          </div>

          <Polls role={role} />
          <ChatBox role={role} />
        </aside>
      </div>

      <footer className="max-w-6xl mx-auto mt-6 text-xs text-gray-500">
        TG Live Classes — demo frontend. Backend (WebSocket + streaming) can be
        added easily.
      </footer>
    </div>
  );
}
