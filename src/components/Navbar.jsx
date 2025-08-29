// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsBell from "./NotificationsBell"; // ⬅️ new import

// Adjust this path if your context lives elsewhere:
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const location = useLocation();

  // Be tolerant of different shapes in your context
  const ctx = useContext(UserContext) || {};
  const userFromCtx =
    ctx.user ?? ctx.currentUser ?? ctx.profile ?? ctx.data ?? null;

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
    { name: "Connect", path: "/connect" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[9000] bg-black/50 backdrop-blur-md shadow-md flex items-center justify-between px-6 md:px-20 h-16">
      {/* Brand */}
      <Link to="/home" className="text-2xl font-bold text-white">
        Skill Mint
      </Link>

      {/* Center nav */}
      <div className="flex gap-6">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`text-white font-medium hover:text-blue-400 transition ${
                active ? "text-blue-400" : ""
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Right controls: Bell + Profile side-by-side */}
      <div className="flex items-center gap-2">
        <NotificationsBell />
        <ProfileDropdown user={userFromCtx} />
      </div>
    </nav>
  );
}
