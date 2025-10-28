import React from "react";

export default function VideoPlayer({ url, role }) {
  return (
    <div className="bg-black rounded-md overflow-hidden">
      <video
        id="liveVideo"
        controls
        playsInline
        autoPlay
        muted={role !== "teacher"}
        style={{ width: "100%", height: "360px", backgroundColor: "#000" }}
      >
        <source src={url} />
        Your browser does not support the video element.
      </video>
      <div className="p-2 text-sm text-gray-300">Live stream URL: {url}</div>
    </div>
  );
}
