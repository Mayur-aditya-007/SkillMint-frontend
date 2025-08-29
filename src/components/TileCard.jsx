// components/TileCard.jsx
import React from "react";
import placeholder from "../assets/placeholder-course.jpg";

export default function TileCard({ image, title, subtitle, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-indigo-500/60 hover:shadow-xl transition text-left"
    >
      <div className="aspect-[16/10] bg-gray-900">
        <img
          src={image || placeholder}
          loading="lazy"
          alt={title || "Tile image"}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = placeholder)}
        />
      </div>

      <div className="p-4">
        {badge && (
          <span className="text-[10px] uppercase tracking-wide text-indigo-300/80">
            {badge}
          </span>
        )}
        <h3 className="text-lg font-semibold mt-0.5 line-clamp-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{subtitle}</p>
        )}
      </div>
    </button>
  );
}
