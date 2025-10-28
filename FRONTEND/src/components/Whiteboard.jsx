import React, { useRef, useState, useEffect } from "react";

export default function Whiteboard({ role }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [strokes, setStrokes] = useState([]);
  const [color, setColor] = useState("#111827");
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    redrawCanvas();
  }, [strokes]);

  function redrawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of strokes) {
      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
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
    if (role !== "teacher") return;
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
  }

  function clearBoard() {
    setStrokes([]);
  }

  function downloadBoard() {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `board_${Date.now()}.png`;
    a.click();
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Whiteboard</h3>
      <div className="flex gap-3 mb-2 items-center">
        <label className="flex gap-2 items-center text-xs">
          Color
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label className="flex gap-2 items-center text-xs">
          Width
          <input
            type="range"
            min={1}
            max={20}
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
        </label>
        {role === "teacher" ? (
          <>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={clearBoard}>
              Clear
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={downloadBoard}>
              Download
            </button>
          </>
        ) : (
          <div className="text-sm text-gray-500">Viewing only</div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={1200}
        height={480}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ width: "100%", height: "320px", background: "#fff", touchAction: "none" }}
      />
    </div>
  );
}
