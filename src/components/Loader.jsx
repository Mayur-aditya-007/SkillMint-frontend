// src/components/Loader.jsx
import React, { useState, useEffect } from "react";

const Loader = ({ videoSrc, onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Preload video
    const video = document.createElement("video");
    video.src = videoSrc;
    video.preload = "auto";
    video.oncanplaythrough = () => {
      setProgress(100);
      setTimeout(onLoaded, 500); // Small delay for smooth transition
    };

    // Fake progress bar for fun
    let fakeProgress = 0;
    const interval = setInterval(() => {
      if (fakeProgress < 90) {
        fakeProgress += Math.random() * 10;
        setProgress(fakeProgress);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [videoSrc, onLoaded]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Spinner */}
      <div className="loader mb-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-700 rounded overflow-hidden">
        <div
          className="h-2 bg-gold"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mt-2 text-sm">Loading... {Math.floor(progress)}%</p>
    </div>
  );
};

export default Loader;
