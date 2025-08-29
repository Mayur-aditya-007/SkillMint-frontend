import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CommunityHighlights2 from "../components/CommunityHighlights2";
import DiscussionCard from "../components/DiscussionCard";

export default function Community() {
  const texts = ["Join the Skill Mint Community", "Learn, Share, and Grow"];
  const [txt, setTxt] = useState("");
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);

  useEffect(() => {
    if (ti >= texts.length) return;
    if (ci < texts[ti].length) {
      const t = setTimeout(() => { setTxt((p) => p + texts[ti][ci]); setCi(ci + 1); }, 50);
      return () => clearTimeout(t);
    } else {
      const n = setTimeout(() => { setTxt(""); setCi(0); setTi(ti + 1); }, 1200);
      return () => clearTimeout(n);
    }
  }, );

  const discussions = [
    { title: "React Hooks Best Practices", description: "Patterns & pitfalls.", author: "Alice" },
    { title: "Portfolio Reviews", description: "Share your repo for feedback.", author: "Bob" },
    { title: "Career AMA", description: "Q&A with senior devs.", author: "Charlie" },
    { title: "CSS Wizardry", description: "Animations & layouts.", author: "Dana" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="mt-16 bg-gray-800 py-10">
        <h1 className="text-4xl font-bold text-center">{txt}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        <aside className="w-full md:w-80 shrink-0">
          <h2 className="text-xl font-semibold mb-4">Trending Communities</h2>
          <CommunityHighlights2 />
        </aside>

        <main className="flex-1 space-y-6">
          <h2 className="text-2xl font-semibold">Latest Discussions</h2>
          {discussions.map((d, i) => (
            <DiscussionCard key={i} {...d} />
          ))}
        </main>
      </div>
    </div>
  );
}
