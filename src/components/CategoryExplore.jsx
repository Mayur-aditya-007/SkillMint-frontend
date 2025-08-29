import React from "react";

const categories = [
  "Web Development", "Data Science", "UI/UX", "Cloud & DevOps", "AI & ML", "Cybersecurity"
];

export default function CategoryExplore({ onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Explore Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="bg-white/10 border border-white/10 text-white rounded-xl p-4 hover:bg-white/20 transition"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
