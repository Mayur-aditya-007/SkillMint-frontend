// src/components/MasonryGrid.jsx
import React from "react";

export default function MasonryGrid({ children, className = "" }) {
  return (
    <div className={`masonry ${className}`}>
      {React.Children.map(children, (child) => (
        <div className="masonry-item">{child}</div>
      ))}
    </div>
  );
}
