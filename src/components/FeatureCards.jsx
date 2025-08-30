import React from "react";

export default function FeatureCards({ cards }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
          <p className="text-white/70">{card.description}</p>
        </div>
      ))}
    </section>
  );
}
