// src/components/Navbar.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsBell from "./NotificationsBell";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const location = useLocation();
  const ctx = useContext(UserContext) || {};
  const userFromCtx = ctx.user ?? ctx.currentUser ?? ctx.profile ?? ctx.data ?? null;

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
    { name: "Connect", path: "/connect" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on outside click / escape
  useEffect(() => {
    const handleOutside = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (!mobileRef.current) return;
      if (!mobileOpen) return;
      if (!mobileRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleOutside);
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-[9000]">
      <nav className="mx-auto flex items-center justify-between gap-4 px-4 md:px-20 h-16 bg-black/60 backdrop-blur-md text-white">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="sr-only">SkillMint Home</span>
            <span className="text-lg md:text-2xl font-bold">Skill Mint</span>
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm md:text-base font-medium transition ${
                  active ? "text-blue-400" : "text-white hover:text-blue-300"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Notifications always visible */}
          <div className="flex items-center">
            <NotificationsBell />
          </div>

          {/* Desktop profile */}
          <div className="hidden md:block">
            <ProfileDropdown user={userFromCtx} />
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded hover:bg-white/10 transition"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        ref={mobileRef}
        className={`md:hidden fixed inset-x-0 top-16 z-[8999] transform-gpu transition-all duration-250 ${
          mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="mx-3 rounded-lg bg-black/85 backdrop-blur-md border border-white/6 shadow-lg overflow-hidden">
          <div className="flex flex-col p-4 gap-3">
            {/* Nav links */}
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block w-full text-left px-3 py-2 rounded-md font-medium transition ${
                    active ? "bg-white/5 text-blue-400" : "text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="border-t border-white/6 my-1" />

            {/* Mobile profile row: uses ProfileDropdown (mobile-ready) and Notifications */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                  {userFromCtx?.name ? userFromCtx.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{userFromCtx?.name ?? "Guest"}</div>
                  <div className="text-xs text-gray-300">{userFromCtx?.email ?? ""}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <NotificationsBell />
                {/* Use same ProfileDropdown component for mobile (it will render bottom-sheet) */}
                <ProfileDropdown user={userFromCtx} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
