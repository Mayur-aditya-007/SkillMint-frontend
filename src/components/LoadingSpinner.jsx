// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ size = 64, message = "Loading..." }) {
  const stroke = 4;
  const viewBox = 64;
  const radius = (viewBox - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/70 backdrop-blur-sm z-[9999]"
    >
      {/* SVG circular spinner */}
      <svg
        className="animate-spin-slow drop-shadow-lg"
        width={size}
        height={size}
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="g" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={radius}
          stroke="#2e2e2e"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Animated ring */}
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={radius}
          stroke="url(#g)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          transform={`rotate(-90 ${viewBox / 2} ${viewBox / 2})`}
        />
      </svg>

      <div className="mt-4 text-sm md:text-base text-green-400 font-medium tracking-wide animate-pulse">
        {message}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 1.3s linear infinite;
        }
      `}</style>
    </div>
  );
}
