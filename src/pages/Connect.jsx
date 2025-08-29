// src/pages/Connect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UsersAPI } from "../api/users";
import { UserPlus2, MessageCircle } from "lucide-react";

const cx = (...x) => x.filter(Boolean).join(" ");

export default function Connect() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  // Load recently joined (shown when search is empty)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setRecentLoading(true);
        const data = await UsersAPI.recent(12); // top 12 recent users
        if (!mounted) return;
        setRecent(data);
      } catch {
        setRecent([]);
      } finally {
        setRecentLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(async () => {
      const term = q.trim();
      if (!term) {
        setRows([]);
        setError("");
        setParams({});
        return;
      }
      try {
        setLoading(true);
        setError("");
        setParams({ q: term });
        const data = await UsersAPI.search(term);
        setRows(data);
      } catch {
        setError("Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, setParams]);

  // If landed with ?q= pre-filled, ensure input shows it
  useEffect(() => {
    if (initialQ && rows.length === 0 && !loading) setQ(initialQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasQuery = q.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Sticky search bar (under navbar) */}
      <div className="sticky top-16 z-20 bg-gray-900/85 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Connect</h1>
          <p className="text-white/60 text-sm mt-1">
            Search people, view profiles, connect, and message.
          </p>

          <div className="mt-4">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search users by name or email…"
                className="w-full h-12 rounded-2xl bg-[#0f1621] border border-white/10 px-4 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 outline-none"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">
                  …
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content area — add generous spacing so nothing feels cramped */}
      <div className="px-6 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">

          {/* Spacer below sticky header to avoid any perceived overlap on some browsers */}
          <div className="h-4" />

          {/* SEARCH RESULTS */}
          {hasQuery && (
            <>
              {!loading && !error && rows.length === 0 && (
                <div className="text-white/60 text-center mt-8">No users found.</div>
              )}
              {error && <div className="text-red-300 text-center mt-8">{error}</div>}

              <div className="mt-6 flex flex-wrap gap-8 justify-center">
                {rows.map((u) => (
                  <UserCard key={u._id} user={u} onOpen={() => navigate(`/users/${u._id}`)} />
                ))}
              </div>
            </>
          )}

          {/* RECENTLY JOINED (Explore-style) */}
          {!hasQuery && (
            <section className="mt-4">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white py-13">Recently joined</h2>
                  <p className="text-white/60 text-sm">Say hi to the newest members.</p>
                </div>
              </div>

              {recentLoading && (
                <div className="text-white/60 text-center mt-8">Loading…</div>
              )}

              {!recentLoading && recent.length === 0 && (
                <div className="text-white/60 text-center mt-8">No recent users yet.</div>
              )}

              <div className="mt-6 flex flex-wrap gap-8 justify-center">
                {recent.map((u) => (
                  <UserCard key={u._id} user={u} onOpen={() => navigate(`/users/${u._id}`)} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function UserCard({ user, onOpen }) {
  const navigate = useNavigate();
  const fullName =
    user?.fullname?.firstname
      ? `${user.fullname.firstname} ${user.fullname.lastname ?? ""}`.trim()
      : user?.name ?? user?.email ?? "User";

  const [busy, setBusy] = useState(false);
  const [connected, setConnected] = useState(Boolean(user.isConnected));

  const handleConnect = async (e) => {
    e.stopPropagation(); // don't trigger card navigation
    try {
      setBusy(true);
      const res = await UsersAPI.connect(user._id);
      if (typeof res?.connected === "boolean") setConnected(res.connected);
      else setConnected((v) => !v); // optimistic fallback
    } catch {
      // optional toast
    } finally {
      setBusy(false);
    }
  };

  const handleMessage = (e) => {
    e.stopPropagation(); // don't trigger card navigation
    navigate(`/messages?peerId=${user._id}`);
  };

  return (
    <div
      onClick={onOpen}
      className="cursor-pointer w-full sm:w-[640px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition"
      title="Open profile"
    >
      {/* Header: avatar + name */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden shrink-0 ring-1 ring-white/20">
          {user.avatar ? (
            <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-white/60 text-2xl">👤</div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-white text-lg font-semibold truncate">{fullName}</div>
          {user.email && <div className="text-white/60 text-sm truncate">{user.email}</div>}
        </div>
      </div>

      {/* Centered action bar */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleConnect}
          disabled={busy}
          className={cx(
            "inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm border",
            connected
              ? "bg-emerald-600/80 border-emerald-500/60 text-white hover:bg-emerald-500/80"
              : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
          )}
        >
          <UserPlus2 className="w-5 h-5" />
          {connected ? "Connected" : "Connect"}
        </button>

        <button
          onClick={handleMessage}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border bg-blue-600/80 border-blue-500/50 text-white hover:bg-blue-500/80 text-sm"
        >
          <MessageCircle className="w-5 h-5 " />
          Message
        </button>
      </div>
    </div>
  );
}
