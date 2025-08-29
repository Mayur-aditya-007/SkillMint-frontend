import React from "react";

export default function CourseGrid({ courses }) {
  return (
    <section className="px-6 md:px-20 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course, idx) => (
        <div
          key={idx}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition"
        >
          <h3 className="text-white font-semibold mb-2">{course.title}</h3>
          <p className="text-white/70 text-sm mb-3">{course.description}</p>
          <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition">
            Enroll
          </button>
        </div>
      ))}
    </section>
  );
}
