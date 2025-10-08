// src/components/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
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

  // close mobile nav when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // close on outside click or ESC
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        // clicking outside will close only when open
        if (mobileOpen) setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handle);
    document.addEventListener("mousedown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      document.removeEventListener("mousedown", handle);
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-[9000]">
      <nav className="mx-auto flex items-center justify-between gap-4 px-4 md:px-20 h-16 bg-black/60 backdrop-blur-md text-white">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="sr-only">SkillMint Home</span>
            <span className="text-xl md:text-2xl font-bold">Skill Mint</span>
          </Link>
        </div>

        {/* Center: Desktop nav (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm md:text-base font-medium hover:text-blue-400 transition ${
                  active ? "text-blue-400" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-3">
          {/* Notifications bell: visible on all sizes */}
          <div className="flex items-center">
            <NotificationsBell />
          </div>

          {/* Profile dropdown (desktop) */}
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
            {/* simple hamburger / X icon */}
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
        className={`md:hidden fixed inset-x-0 top-16 z-[8999] transform-gpu transition-all duration-300 ${
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

            {/* Auth actions */}
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 transition font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-full text-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                Sign up
              </Link>
            </div>

            <div className="border-t border-white/6 my-1" />

            {/* Mobile profile + notifications row */}
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

              <div>
                <NotificationsBell />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
