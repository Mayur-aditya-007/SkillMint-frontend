import React from "react";
import { Link } from "react-router-dom";

// Example categories
const categories = [
  { name: "Web Development", color: "bg-blue-500" },
  { name: "Data Science", color: "bg-green-500" },
  { name: "Design", color: "bg-purple-500" },
  { name: "Mobile Apps", color: "bg-red-500" },
  { name: "AI & ML", color: "bg-yellow-500" },
  { name: "Cloud Computing", color: "bg-indigo-500" },
];

export default function CategoryTiles() {
  return (
    <section className="flex flex-wrap justify-center gap-6 py-12 px-6 md:px-20">
      {categories.map((cat, idx) => (
        <Link
          to={`/explore/${cat.name.toLowerCase().replace(/ /g, "-")}`}
          key={idx}
          className={`${cat.color} text-white font-semibold px-6 py-4 rounded-2xl shadow-lg hover:scale-105 transition`}
        >
          {cat.name}
        </Link>
      ))}
    </section>
  );
}
