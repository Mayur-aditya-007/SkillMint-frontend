// src/components/ReviewModal.jsx
import React, { useState } from "react";
import { X, Star, Send } from "lucide-react";

// Read backend URL from env (e.g., VITE_BASE_URL=http://localhost:4000)
// If you use a Vite proxy for /api, you can leave it empty.
const API = import.meta.env.VITE_BASE_URL || "";

export default function ReviewModal({ open, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const stars = [1, 2, 3, 4, 5];

  const submit = async () => {
    if (!rating) return alert("Please select a star rating.");
    setBusy(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ rating, text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      onSubmitted?.();
      setRating(0);
      setText("");
      onClose?.();
    } catch (e) {
      alert(`Could not submit review: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="absolute inset-x-0 top-12 mx-auto w-[95vw] max-w-lg">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[rgba(17,24,39,0.88)] text-white backdrop-blur-xl">
          {/* neon ring */}
          <div
            className="pointer-events-none absolute -inset-[2px] rounded-[26px] opacity-40
                       bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0%,#a78bfa_25%,#f472b6_50%,#22d3ee_100%)]
                       animate-[spin_10s_linear_infinite]"
            style={{ maskImage: "linear-gradient(#000,transparent)", WebkitMaskImage: "linear-gradient(#000,transparent)" }}
          />

          {/* header */}
          <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div>
              <h3 className="font-semibold text-lg">We value your review</h3>
              <p className="text-xs text-white/70">Tell us how your experience has been.</p>
            </div>
            <button className="p-2 rounded-xl hover:bg-white/10" onClick={onClose} aria-label="Close">
              <X />
            </button>
          </div>

          {/* body */}
          <div className="relative p-5 space-y-4">
            {/* stars */}
            <div className="flex items-center gap-2">
              {stars.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  className="p-1"
                  aria-label={`${s} star`}
                >
                  <Star
                    className="w-7 h-7 transition"
                    fill={(hover || rating) >= s ? "url(#grad)" : "none"}
                    stroke={(hover || rating) >= s ? "transparent" : "currentColor"}
                  />
                </button>
              ))}
              {/* gradient definition */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* input */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write your review..."
              className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40 placeholder:text-white/50"
            />
          </div>

          {/* footer */}
          <div className="relative px-5 py-4 border-t border-white/10">
            <div className="flex justify-end">
              <button
                onClick={submit}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5
                           bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-pink-500
                           hover:opacity-95 active:scale-95 transition disabled:opacity-50
                           shadow-[0_8px_24px_rgba(236,72,153,0.35)]"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
