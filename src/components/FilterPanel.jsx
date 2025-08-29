import React from "react";

const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const categoryOptions = ["Web Dev", "Data", "Design", "ML/AI"];
const priceOptions = ["Free", "Paid"];

export default function FilterPanel({ filters, setFilters }) {
  const toggleArrayValue = (key, value) => {
    setFilters(prev => {
      const arr = new Set(prev[key]);
      arr.has(value) ? arr.delete(value) : arr.add(value);
      return { ...prev, [key]: Array.from(arr) };
    });
  };

  const setRange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <aside className="sticky top-24 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-4">
      <h3 className="text-white font-semibold mb-3">Filters</h3>

      <div className="mb-4">
        <p className="text-white/80 text-sm mb-2">Level</p>
        <div className="flex flex-wrap gap-2">
          {levelOptions.map(opt => (
            <button
              key={opt}
              onClick={() => toggleArrayValue("levels", opt)}
              className={`px-3 py-1.5 rounded-xl border transition 
                ${filters.levels.includes(opt)
                  ? "bg-blue-500/20 border-blue-400 text-white"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-white/80 text-sm mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map(opt => (
            <button
              key={opt}
              onClick={() => toggleArrayValue("categories", opt)}
              className={`px-3 py-1.5 rounded-xl border transition 
                ${filters.categories.includes(opt)
                  ? "bg-blue-500/20 border-blue-400 text-white"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-white/80 text-sm mb-2">Price</p>
        <div className="flex flex-wrap gap-2">
          {priceOptions.map(opt => (
            <button
              key={opt}
              onClick={() => toggleArrayValue("price", opt)}
              className={`px-3 py-1.5 rounded-xl border transition 
                ${filters.price.includes(opt)
                  ? "bg-blue-500/20 border-blue-400 text-white"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-white/80 text-sm mb-2">
          Max Duration (hours): {filters.maxDuration}
        </p>
        <input
          type="range"
          min={1}
          max={50}
          value={filters.maxDuration}
          onChange={(e) => setRange("maxDuration", Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <button
        onClick={() =>
          setFilters({ levels: [], categories: [], price: [], maxDuration: 50 })
        }
        className="mt-3 w-full rounded-xl bg-white/10 hover:bg-white/20 text-white py-2 border border-white/10 transition"
      >
        Reset
      </button>
    </aside>
  );
}
