// /src/components/NotificationsBell.jsx
import React, { useEffect, useRef, useState } from "react";
import { Bell, Circle } from "lucide-react";
import { connectSocket, getSocket } from "../lib/socket.js"; // ✅ use named exports that exist

export default function NotificationsBell({ token, userId }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]); // [{ type: "presence" | "message", text, ts }]
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  // Connect once (or reuse) and wire listeners
  useEffect(() => {
    const s = connectSocket(token); // pass auth token if needed

    const onPresence = ({ userId: uid, online }) => {
      setItems((prev) => [
        {
          type: "presence",
          text: `User ${uid} is ${online ? "online" : "offline"}`,
          ts: Date.now(),
        },
        ...prev,
      ].slice(0, 50));
      setUnread((u) => u + 1);
    };

    const onNew = (payload) => {
      const msg =
        payload?.content ||
        payload?.message?.content ||
        "New message";
      setItems((prev) => [
        { type: "message", text: msg, ts: Date.now() },
        ...prev,
      ].slice(0, 50));
      setUnread((u) => u + 1);
    };

    s.on("presence:update", onPresence);
    s.on("message:new", onNew);

    // Optional: notify server who we are (if your backend expects it)
    if (userId) s.emit("notifications:join", { userId });

    return () => {
      s.off("presence:update", onPresence);
      s.off("message:new", onNew);
    };
  }, [token, userId]);

  // Close on outside click
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const openPanel = () => {
    setOpen((o) => {
      const willOpen = !o;
      if (willOpen) setUnread(0);
      return willOpen;
    });
  };

  // (optional) show a subtle warning if socket not connected
  const connected = !!getSocket()?.connected;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={openPanel}
        className="relative p-2 rounded-full hover:bg-white/10"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-white" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5">
            <Circle className="w-3 h-3 text-rose-400 fill-rose-400" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-[#0f1621] border border-white/10 rounded-xl shadow-xl p-2 z-[999]">
          <div className="text-white/80 font-medium px-2 py-1 flex items-center justify-between">
            <span>Live Notifications</span>
            {!connected && (
              <span className="text-[10px] text-white/40">offline</span>
            )}
          </div>

          <div className="max-h-80 overflow-auto">
            {items.length === 0 ? (
              <div className="text-white/60 text-sm px-2 py-3">
                No notifications.
              </div>
            ) : (
              items.map((it, i) => (
                <div
                  key={i}
                  className="px-2 py-2 rounded hover:bg-white/5 text-sm text-white/80"
                >
                  <span className="uppercase text-[10px] text-white/40">
                    {it.type}
                  </span>
                  <div>{it.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
