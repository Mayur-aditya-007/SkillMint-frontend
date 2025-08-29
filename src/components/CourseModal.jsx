import React, { useState } from "react";
import { X, ExternalLink, BookOpen, CheckCircle, Plus, Check } from "lucide-react";

const API = import.meta.env.VITE_BASE_URL || "";

export default function CourseModal({
  course,
  onClose,
  onAddCourse,               // optional override (kept), but we still log POST attempts
  isAddedToProfile = false,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(isAddedToProfile);

  if (!course) return null;

  const courseId = course.id || course._id || course.courseId;
  const name = course.name || course.title || course.courseName || "Untitled Course";
  const thumbnail = course.thumbnail || course.image || "";

  const coursePath = courseId ? `/courses/${courseId}` : "/home";

  // POST /api/enrollments
  const enrollViaAPI = async () => {
    const token = localStorage.getItem("token"); // change key if your app uses a different one
    const url = `${API}/api/enrollments`;
    const body = { courseId, name, thumbnail };

    console.log("[CourseModal] ENROLL →", url, body, "token?", !!token);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    console.log("[CourseModal] ENROLL status:", res.status);
    let data = {};
    try { data = await res.json(); } catch {}
    console.log("[CourseModal] ENROLL resp:", data);

    if (!res.ok) {
      if (res.status === 401) {
        alert("You need to be logged in to enroll.");
      }
      throw new Error(`Enroll failed: HTTP ${res.status}`);
    }
    return data;
  };

  const doAddAndRedirect = async (where = "home") => {
    if (isAdded || isAdding) return;
    if (!courseId) {
      console.error("[CourseModal] Missing courseId. Course=", course);
      alert("Cannot enroll: course is missing an ID.");
      return;
    }
    setIsAdding(true);
    try {
      if (onAddCourse) {
        // If a parent handler exists, still try backend so data persists
        await Promise.allSettled([onAddCourse(course), enrollViaAPI()]);
      } else {
        await enrollViaAPI();
      }
      setIsAdded(true);
      setTimeout(() => {
        window.location.href = where === "course" ? coursePath : "/home";
      }, 500);
    } catch (err) {
      console.error("Failed to add course:", err);
      setIsAdded(false);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-4 border-b border-white/10 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent line-clamp-2">
              {name}
            </h2>
            <div className="flex items-center gap-2">
              {/* Add */}
              <button
                onClick={() => doAddAndRedirect("home")}
                disabled={isAdding || isAdded}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  isAdded
                    ? "bg-green-500/20 text-green-400 cursor-default"
                    : isAdding
                    ? "bg-indigo-500/20 text-indigo-400 cursor-wait"
                    : "bg-white/10 text-white/90 hover:bg-white/20"
                }`}
              >
                {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {isAdded ? "Added" : "Add"}
              </button>

              {/* Learn+ */}
              <button
                onClick={() => doAddAndRedirect("course")}
                disabled={isAdding || isAdded}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  isAdded
                    ? "bg-green-500/20 text-green-400 cursor-default"
                    : isAdding
                    ? "bg-indigo-500/20 text-indigo-400 cursor-wait"
                    : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3 h-3" /> Added
                  </>
                ) : isAdding ? (
                  <>
                    <div className="w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" /> Learn+
                  </>
                )}
              </button>

              {/* Close */}
              <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20">
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-100px)] p-4 space-y-4">
          {thumbnail && (
            <img src={thumbnail} alt={name} className="w-full h-40 object-cover rounded-lg" />
          )}

          {course.about && (
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> About
              </h3>
              <p className="text-sm text-gray-300 mt-1">{course.about}</p>
            </div>
          )}

          {Array.isArray(course.requirements) && course.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" /> Requirements
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {course.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {course.resources?.links?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400" /> Resources
              </h3>
              <ul className="list-disc list-inside text-sm text-blue-300">
                {course.resources.links.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
