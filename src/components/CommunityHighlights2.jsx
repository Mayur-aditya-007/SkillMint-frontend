// CommunityHighlights.jsx
import React from "react";

const communities = [
  { name: "Web Development", members: 1200 },
  { name: "Data Science", members: 950 },
  { name: "UI/UX Design", members: 700 },
  { name: "Machine Learning", members: 450 },
  { name: "Blockchain", members: 300 },
];

const CommunityHighlights2 = () => {
  return (
    <div className="space-y-4">
      {communities.map((community, index) => (
        <div
          key={index}
          className="p-3 bg-white/10 backdrop-blur-md rounded-xl cursor-pointer hover:bg-white/20 transition"
        >
          <h3 className="font-semibold">{community.name}</h3>
          <p className="text-white/70 text-sm">
            {community.members} members
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommunityHighlights2;
