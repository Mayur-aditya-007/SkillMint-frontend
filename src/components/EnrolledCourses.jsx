// src/components/EnrolledCourses.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";

const glowBtn =
  "inline-flex items-center justify-center p-2 rounded-full " +
  "bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-600 " +
  "shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] " +
  "text-white transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-300/60";

export default function EnrolledCourses({ courses = [], loading }) {
  const navigate = useNavigate();

  const toCourse = (c, idx) => {
    const id = c.courseId || c.id || c._id || String(idx);
    if (!id) return;
    navigate(`/courses/${id}`);
  };

  const toAdvanced = (e, c, idx) => {
    e.stopPropagation(); // keep card click from firing
    const id = c.courseId || c.id || c._id || String(idx);
    if (!id) return;
    navigate(`/advanced-learning/${id}`);
  };

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Your Courses</h2>

      {loading ? (
        <div className="text-white/70">Loading your courses…</div>
      ) : !courses || courses.length === 0 ? (
        <div className="text-white/60">You haven’t enrolled in any courses yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => {
            const name = c.courseName || c.title || c.name || "Untitled Course";
            const thumb = c.thumbnail || c.image || "";
            const progress = typeof c.progress === "number" ? c.progress : 0;
            const id = c.courseId || c.id || c._id || i;

            return (
              <article
                key={id}
                role="button"
                tabIndex={0}
                aria-label={`Open course ${name}`}
                onClick={() => toCourse(c, i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toCourse(c, i)}
                className="relative rounded-lg overflow-hidden border border-white/10 bg-gray-800/60 cursor-pointer 
                           hover:border-white/20 hover:bg-gray-800 transition"
              >
                {/* Neon Advanced Learning bulb (per-card) */}
                <button
                  title="Advanced Learning"
                  aria-label="Open in Advanced Learning"
                  className={`absolute top-2 right-2 z-10 ${glowBtn}`}
                  onClick={(e) => toAdvanced(e, c, i)}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>

                {thumb ? (
                  <img
                    src={thumb}
                    alt={name}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-700" />
                )}

                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2">{name}</h3>
                  <div className="mt-3 h-2 bg-gray-700 rounded">
                    <div
                      className="h-2 bg-green-500 rounded"
                      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    Progress: {Math.round(progress)}%
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
