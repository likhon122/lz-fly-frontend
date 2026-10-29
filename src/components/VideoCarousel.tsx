"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    video: "/assets/videos/hero1.mp4",
    poster: "/assets/videos/hero-poster.webp",
    label: "3D & Motion",
  },
  {
    video: "/assets/videos/hero2.mp4",
    poster: "/assets/videos/hero2-poster.webp",
    label: "UI & Product",
  },
  {
    video: "/assets/videos/hero3.mp4",
    poster: "/assets/videos/hero3-poster.webp",
    label: "Branding",
  },
];

export const VideoCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  const playVideo = useCallback(() => {
    const v = videoRef.current;
    if (v && visibleRef.current) {
      v.play().catch(() => {});
    }
  }, []);

  // Video ended → auto advance to next slide
  const onEnded = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, []);

  // When current slide changes, update video src and play
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = slides[current].video;
    v.poster = slides[current].poster;
    v.load();
    playVideo();
  }, [current, playVideo]);

  // Pause when off-screen to save GPU/CPU
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting;
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) {
          playVideo();
        } else {
          v.pause();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [playVideo]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950"
      style={{ contain: "paint layout" }}
    >
      {/* Instant fallback background image from slide 0 poster — guarantees frame-0 visibility */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${slides[current].poster})`,
        }}
      />

      {/* Video element — always opacity-100 so poster & video render without delay */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        muted
        playsInline
        preload="metadata"
        poster={slides[current].poster}
        onEnded={onEnded}
      >
        <source src={slides[current].video} type="video/mp4" />
      </video>

      {/* Contrast dark overlay — ensures text & buttons are 100% visible with crisp contrast */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Interactive Slider Navigation Controls */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-2 pointer-events-auto">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              current === idx
                ? "bg-white/20 text-white border border-white/40"
                : "bg-black/40 text-white/60 hover:text-white hover:bg-black/60 border border-white/10"
            }`}
            aria-label={`Go to slide ${idx + 1}: ${slide.label}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                current === idx ? "bg-primary" : "bg-white/40 group-hover:bg-white"
              }`}
            />
            <span className="hidden sm:inline">{slide.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
