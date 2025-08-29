// DiscussionCard.jsx
import React from "react";

const DiscussionCard = ({ title, description, author }) => {
  return (
    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-white/70 mt-2">{description}</p>
      <p className="text-white/50 text-sm mt-2">By {author}</p>
    </div>
  );
};

export default DiscussionCard;
