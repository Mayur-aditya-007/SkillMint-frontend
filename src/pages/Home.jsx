import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import EnrolledCourses from "../components/EnrolledCourses";
import LatestCoursesSidebar from "../components/LatestCoursesSidebar";
import FeatureCards from "../components/FeatureCards";
import CommunityHighlights from "../components/CommunityHighlights";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";           // ⬅️ added
import { Lightbulb } from "lucide-react";                 // ⬅️ added

const API = import.meta.env.VITE_BASE_URL || "";

// neon FAB style
const glowBtn =
  "inline-flex items-center justify-center p-3 rounded-full " +
  "bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-600 " +
  "shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(99,102,241,0.75)] " +
  "text-white transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-300/60";

const latestCourses = [
  "Machine Learning Basics",
  "UI/UX Design Fundamentals",
  "Next.js for Beginners",
  "Data Structures in JavaScript",
  "Cloud Computing Essentials",
];

const featureCards = [
  { title: "Skill Paths", description: "Step-by-step learning paths to master coding, design, and more." },
  { title: "Quick Resources", description: "Curated articles, videos, and tutorials to speed up your learning." },
  { title: "Community", description: "Connect with peers, share tips, and get guidance on your learning journey." },
];

const communityHighlights = [
  { title: "Discussion: JS Tips", description: "See how others are mastering advanced JavaScript concepts." },
  { title: "React Project Ideas", description: "Collaborative ideas from learners around the world." },
];

export default function Home() {
  const { user } = useContext(UserContext);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();                         // ⬅️ added

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        // Add ts to bypass caches and explicitly set no-store
        const url = `${API}/api/enrollments?ts=${Date.now()}`;
        console.log("[Home] FETCH →", url, "token?", !!token);

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          credentials: "include",
        });

        console.log("[Home] GET /api/enrollments status:", res.status);
        const data = await res.json().catch(() => []);
        console.log("[Home] enrollments payload:", data);

        setEnrolled(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load enrollments:", e);
        setEnrolled([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-gray-900">
      <Navbar user={user} />
      <HeroBanner />

      <div className="relative z-10 flex flex-col md:flex-row px-6 md:px-20 mt-10 gap-8">
        <LatestCoursesSidebar latestCourses={latestCourses} />
        <main className="flex-1 flex flex-col gap-12">
          {/* Renders whatever the backend returns */}
          <EnrolledCourses courses={enrolled} loading={loading} />
          <FeatureCards cards={featureCards} />
          <CommunityHighlights highlights={communityHighlights} />
        </main>
      </div>

      {/* 🔮 Glowing neon lightbulb FAB → Advanced Learning */}
      <button
        onClick={() => navigate("/advanced-learning")}
        title="Go to Advanced Learning"
        className={`fixed right-5 bottom-5 z-50 ${glowBtn}`}
        aria-label="Advanced Learning"
      >
        <Lightbulb className="w-6 h-6" />
      </button>

      <footer className="relative z-10 bg-black/70 text-white py-6 px-6 md:px-20 text-center mt-16">
        &copy; 2025 Skill Mint. All rights reserved.
      </footer>
    </div>
  );
}
