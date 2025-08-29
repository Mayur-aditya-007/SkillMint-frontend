import React from "react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center text-center px-6 md:px-20 pt-28 md:pt-40 bg-cover bg-center" style={{ backgroundImage: `url('/homebackground.jpg')` }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Learn Skills Faster, Smarter
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Confused about what to learn next? Explore curated resources, courses,
          and community guidance to master skills efficiently.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/courses"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-md transition"
          >
            Browse Courses
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold shadow-md transition"
          >
            Explore Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
