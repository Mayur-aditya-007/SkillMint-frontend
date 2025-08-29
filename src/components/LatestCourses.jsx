import React from "react";

const items = [
  { id: 1, title: "React.js Advanced", about: "Hooks, context & patterns." },
  { id: 2, title: "Node & Express", about: "APIs, auth & middleware." },
  { id: 3, title: "Figma Essentials", about: "Design systems, prototyping." },
  { id: 4, title: "Python for Data", about: "Pandas, plotting, pipelines." },
  { id: 5, title: "Next.js Basics", about: "App router, SSR, ISR." },
  { id: 6, title: "Tailwind Mastery", about: "Layouts, theming, a11y." },
];

export default function LatestCourses({ onSelectCourse }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-white mb-4">Latest Courses</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map(c => (
          <div
            key={c.id}
            onClick={() => onSelectCourse(c)}
            className="break-inside-avoid bg-white/10 border border-white/10 rounded-xl p-4 hover:bg-white/15 cursor-pointer text-white"
          >
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-gray-200 mt-2">{c.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
