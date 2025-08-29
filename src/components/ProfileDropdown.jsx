// src/components/ProfileDropdown.jsx
import React, { useEffect, useLayoutEffect, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // adjust path if needed

// Fallback avatar
const defaultAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
      <rect width='100%' height='100%' fill='#1f2937'/>
      <text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle'
            font-family='sans-serif' font-size='56' fill='#9ca3af'>👤</text>
    </svg>`
  );

export default function ProfileDropdown({ user: userProp }) {
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ left: 0, top: 0, width: 0, height: 0 });

  // Also read from context in case no prop was passed (Messages/Connect)
  const ctx = useContext(UserContext) || {};
  const userCtx = ctx.user ?? ctx.currentUser ?? ctx.profile ?? ctx.data ?? null;

  const user = userProp || userCtx;

  const first = user?.fullname?.firstname ?? user?.firstname ?? "";
  const last  = user?.fullname?.lastname  ?? user?.lastname  ?? "";
  const displayName = [first, last].filter(Boolean).join(" ") || "User";
  const avatarSrc = user?.avatar || defaultAvatar;

  const measure = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAnchor({ left: r.left, top: r.top, width: r.width, height: r.height });
  };

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    const onScroll = () => measure();
    const onResize = () => measure();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize, true);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-full pl-2 pr-3 py-1.5 bg-white/10 border border-white/10 hover:bg-white/20 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={avatarSrc}
          alt={displayName}
          className="w-9 h-9 rounded-full object-cover border border-white/20"
        />
        <span className="hidden md:block text-white font-medium max-w-[12rem] truncate">
          {displayName}
        </span>
        <svg
          className="w-4 h-4 text-white/80"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.956a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0l-4.24-4.52a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Portal (overlay + menu) so it stays above sticky bars */}
      {open &&
        createPortal(
          <>
            {/* Overlay */}
            <button
              aria-hidden
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[9998]"
              style={{ pointerEvents: "auto" }}
            />

            {/* Menu */}
            <div
              role="menu"
              className="fixed w-64 rounded-2xl bg-[#0f1621] border border-white/10 shadow-xl overflow-hidden z-[9999]"
              style={{
                left: Math.max(8, anchor.left + anchor.width - 256), // 256px = menu width
                top: anchor.top + anchor.height + 8,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-3 border-b border-white/10">
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">{displayName}</div>
                </div>
              </div>

              {/* Items */}
              <div className="p-2">
                <MenuItem onClick={() => go("/myprofile")}>My Profile</MenuItem>
                <MenuItem onClick={() => go("/settings/profile")}>Edit Profile</MenuItem>
                <MenuItem onClick={() => go("/messages")}>Messages</MenuItem>
                <MenuItem onClick={() => go("/connect")}>Connect</MenuItem>
                <MenuItem onClick={() => go("/explore")}>Explore</MenuItem>
                <Divider />
                <MenuItem onClick={() => go("/settings")}>Settings</MenuItem>
                <MenuItem onClick={() => go("/user/logout")} danger>
                  Logout
                </MenuItem>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

function MenuItem({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-xl transition ${
        danger ? "text-red-300 hover:bg-red-500/10" : "text-white/90 hover:bg-white/10"
      }`}
      role="menuitem"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="h-px my-1 bg-white/10" />;
}
