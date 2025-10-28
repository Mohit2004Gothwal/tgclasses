import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ url, role }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }

    return () => {
      if (Hls.isSupported()) {
        // Cleanup if needed
      }
    };
  }, [url]);

  return (
    <div className="bg-black rounded-md overflow-hidden">
      <video
        ref={videoRef}
        id="liveVideo"
        controls
        playsInline
        autoPlay
        muted={role !== "teacher"}
        style={{ width: "100%", height: "360px", backgroundColor: "#000" }}
      >
        Your browser does not support the video element.
      </video>
      <div className="p-2 text-sm text-gray-300">Live stream URL: {url}</div>
    </div>
  );
}
