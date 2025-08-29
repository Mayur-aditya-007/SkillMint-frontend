// src/components/CourseCard.jsx
import React from "react";
import placeholder from "../assets/placeholder-course.jpg";

export default function CourseCard({ course, onClick }) {
  const src = course?.thumbnail || placeholder;

  return (
    <button
      onClick={onClick}
      className="block w-full text-left rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-indigo-500/60
                 shadow-sm hover:shadow-lg transition"
      aria-label={course?.name || "Open course"}
    >
      <img
        src={src}
        loading="lazy"
        alt={course?.name || "Course thumbnail"}
        className="w-full h-auto block"
        onError={(e) => (e.currentTarget.src = placeholder)}
        referrerPolicy="no-referrer"
      />

      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2">
          {course?.name || "Untitled course"}
        </h3>
        {course?.about && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-3">{course.about}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {course?.category && (
            <span className="text-[10px] rounded-full bg-white/5 px-2 py-0.5 border border-white/10 text-gray-300">
              {course.category}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
