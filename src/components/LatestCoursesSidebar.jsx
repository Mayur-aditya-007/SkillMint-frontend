import React from "react";

export default function LatestCoursesSidebar({ latestCourses }) {
  return (
    <aside className="hidden md:block md:w-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 h-fit">
      <h3 className="text-white font-bold text-lg mb-4">Latest Courses</h3>
      <ul className="flex flex-col gap-3">
        {latestCourses.map((course, idx) => (
          <li key={idx} className="text-white/80 hover:text-white cursor-pointer transition">
            {course}
          </li>
        ))}
      </ul>
    </aside>
  );
}
