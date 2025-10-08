import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import EnrolledCourses from "../components/EnrolledCourses";
import LatestCoursesSidebar from "../components/LatestCoursesSidebar";
import FeatureCards from "../components/FeatureCards";
import CommunityHighlights from "../components/CommunityHighlights";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";

const API = import.meta.env.VITE_BASE_URL || "";

const glowBtn =
  "inline-flex items-center justify-center p-3 rounded-full " +
  "bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-600 " +
  "shadow-[0_0_15px_rgba(99,102,241,0.45)] hover:shadow-[0_0_25px_rgba(99,102,241,0.75)] " +
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
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${API}/api/enrollments?ts=${Date.now()}`;
        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });
        const data = await res.json().catch(() => []);
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
    <div className="min-h-screen w-full relative bg-gray-900 text-white">
      <Navbar user={user} />
      <HeroBanner />

      <div className="relative z-10 flex flex-col md:flex-row px-4 md:px-20 mt-6 md:mt-10 gap-6 md:gap-8">
        <LatestCoursesSidebar latestCourses={latestCourses} className="w-full md:w-1/4" />
        <main className="flex-1 flex flex-col gap-8 md:gap-12">
          <EnrolledCourses courses={enrolled} loading={loading} />
          <FeatureCards cards={featureCards} />
          <CommunityHighlights highlights={communityHighlights} />
        </main>
      </div>

      {/* Glowing neon FAB */}
      <button
        onClick={() => navigate("/advanced-learning")}
        title="Go to Advanced Learning"
        className={`fixed right-4 md:right-5 bottom-4 md:bottom-5 z-50 ${glowBtn}`}
        aria-label="Advanced Learning"
      >
        <Lightbulb className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <footer className="relative z-10 bg-black/70 text-white py-4 md:py-6 px-4 md:px-20 text-center mt-10 md:mt-16 text-sm md:text-base">
        &copy; 2025 Skill Mint. All rights reserved.
      </footer>
    </div>
  );
}
