import React from "react";

export default function EnrolledCoursesAdvanced({ courses = [], loading, selectedId, onSelect }) {
  if (loading) return <div className="text-white/70">Loading your courses…</div>;
  if (!courses?.length) return <div className="text-white/60">No enrolled courses yet.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {courses.map((c, i) => {
        const id = c.courseId || c.id || c._id || String(i);
        const active = selectedId && id === selectedId;
        const name = c.courseName || c.title || c.name || "Untitled Course";
        const thumb = c.thumbnail || c.image || "";
        return (
          <button
            type="button"
            key={id}
            onClick={() => onSelect?.(id)}
            className={`text-left rounded-xl overflow-hidden border transition ${
              active ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
            title={active ? "Selected" : "Click to focus advanced mode"}
          >
            <div className="h-24 w-full overflow-hidden bg-black/30">
              {thumb ? <img src={thumb} alt={name} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="p-3">
              <div className="font-semibold line-clamp-2">{name}</div>
              <div className="text-xs text-white/60 mt-1">Advanced mode · select to link tools</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
