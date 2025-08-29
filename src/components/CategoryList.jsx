// src/components/CategoryList.jsx
import React from "react";

export default function CategoryList({ categories, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-4 text-center shadow-md"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
