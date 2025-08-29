import React, { useEffect, useMemo, useState } from "react";
import { UsersAPI } from "../api/users";
import { Link } from "react-router-dom";

const cx = (...x) => x.filter(Boolean).join(" ");

export default function UserSearch({ className = "" }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  // debounce search
  useEffect(() => {
    if (!q.trim()) { setRows([]); setError(""); return; }
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const data = await UsersAPI.search(q.trim());
        setRows(data);
      } catch (e) {
        setError("Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className={cx("w-full", className)}>
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people by name or email…"
          className="w-full h-12 rounded-2xl bg-[#0f1621] border border-white/10 px-4 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 outline-none"
        />
        {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">…</div>}
      </div>

      {/* Results */}
      {q && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl max-h-80 overflow-auto">
          {error && <div className="p-3 text-red-300 text-sm">{error}</div>}
          {!error && rows.length === 0 && !loading && (
            <div className="p-3 text-white/50 text-sm">No users found</div>
          )}
          {rows.map((u) => {
            const name = u.fullname?.firstname
              ? `${u.fullname.firstname} ${u.fullname.lastname ?? ""}`.trim()
              : u.name ?? u.email;
            return (
              <Link
                key={u._id}
                to={`/users/${u._id}`}
                className="flex items-center gap-3 p-3 border-b border-white/10 last:border-b-0 hover:bg-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden shrink-0">
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-white/60">👤</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-medium truncate">{name || "User"}</div>
                  <div className="text-white/60 text-xs truncate">{u.email}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
