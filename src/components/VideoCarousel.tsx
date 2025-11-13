"use client";

import React, { useState, useEffect, useRef } from "react";

const videos = [
  "/assets/videos/hero1.mp4",
  "/assets/videos/hero2.mp4",
  "/assets/videos/hero3.mp4"
];

export const VideoCarousel: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoEnd = () => {
      // Move to next video when current video ends
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    const handleCanPlay = () => {
      // Ensure video plays when it can
      videoElement.play().catch((error) => {
        console.log("Video autoplay prevented:", error);
      });
    };

    videoElement.addEventListener("ended", handleVideoEnd);
    videoElement.addEventListener("canplay", handleCanPlay);

    // Try to play immediately
    videoElement.play().catch((error) => {
      console.log("Initial video autoplay prevented:", error);
    });

    return () => {
      videoElement.removeEventListener("ended", handleVideoEnd);
      videoElement.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentVideoIndex]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        key={currentVideoIndex}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        autoPlay
        playsInline
        preload="auto"
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
    </div>
  );
};
