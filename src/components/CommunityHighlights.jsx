import React from "react";

export default function CommunityHighlights({ highlights }) {
  return (
    <section>
      <h2 className="text-white text-2xl font-bold mb-4">Community Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((item, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition">
            <h4 className="text-white font-semibold mb-2">{item.title}</h4>
            <p className="text-white/70 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}