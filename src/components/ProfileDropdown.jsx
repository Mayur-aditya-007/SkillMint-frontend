// src/components/ProfileDropdown.jsx
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // adjust path if needed

// Fallback avatar (inline SVG data URL)
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
  const [isMobile, setIsMobile] = useState(false);

  // context fallback
  const ctx = useContext(UserContext) || {};
  const userCtx = ctx.user ?? ctx.currentUser ?? ctx.profile ?? ctx.data ?? null;
  const user = userProp || userCtx;

  const first = user?.fullname?.firstname ?? user?.firstname ?? "";
  const last = user?.fullname?.lastname ?? user?.lastname ?? "";
  const displayName = [first, last].filter(Boolean).join(" ") || "User";
  const avatarSrc = user?.avatar || defaultAvatar;

  // measure anchor (desktop popover)
  const measure = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAnchor({ left: r.left, top: r.top, width: r.width, height: r.height });
  };

  // update mobile state on resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // measure only when opening desktop popover
  useLayoutEffect(() => {
    if (!open || isMobile) return;
    measure();
    const onScroll = () => measure();
    const onResize = () => measure();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize, true);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize, true);
    };
  }, [open, isMobile]);

  // close on Esc
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  // navigate helper that closes menu
  const go = (path) => {
    setOpen(false);
    // small delay to allow animation/overlay to hide before pushing route
    setTimeout(() => navigate(path), 80);
  };

  // render menu content (reuse for desktop popover and mobile sheet)
  const MenuContent = (
    <div className="p-2">
      <div className="flex items-center gap-3 p-3 border-b border-white/10">
        <img
          src={avatarSrc}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover border border-white/20"
        />
        <div className="min-w-0">
          <div className="text-white font-semibold truncate">{displayName}</div>
          {user?.email && <div className="text-xs text-gray-400 truncate">{user.email}</div>}
        </div>
      </div>

      <div className="p-2 space-y-1">
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
  );

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
        {/* hide name on small widths to save space */}
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

      {/* Portal UI */}
      {open &&
        createPortal(
          <>
            {/* Overlay (click outside to close) */}
            <button
              aria-hidden
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[9998]"
              style={{ pointerEvents: "auto" }}
            />

            {/* Mobile: Bottom sheet */}
            {isMobile ? (
              <div
                role="menu"
                className="fixed left-0 right-0 bottom-0 z-[9999] bg-[#0f1621] border-t border-white/8 shadow-xl rounded-t-2xl overflow-hidden"
                style={{ minHeight: "36%", maxHeight: "70%" }}
                aria-label="Profile menu"
              >
                {/* Drag handle */}
                <div className="w-full flex justify-center py-2">
                  <div className="w-14 h-1.5 rounded-full bg-white/10" />
                </div>
                <div className="overflow-auto">{MenuContent}</div>
              </div>
            ) : (
              // Desktop popover anchored near avatar button (measured)
              <div
                role="menu"
                className="fixed w-64 rounded-2xl bg-[#0f1621] border border-white/10 shadow-xl overflow-hidden z-[9999]"
                style={{
                  left: Math.max(8, anchor.left + anchor.width - 256), // 256px = menu width
                  top: anchor.top + anchor.height + 8,
                }}
                aria-label="Profile menu"
              >
                {MenuContent}
              </div>
            )}
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
