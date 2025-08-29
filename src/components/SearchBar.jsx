// src/components/SearchBar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL || "/api";

export default function SearchBar({
  value,
  onChange,
  onSubmitSearch,
  onSelectCourse,
  limit = 8,
}) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef(null);

  const debounced = useDebouncedValue(value, 250);

  useEffect(() => {
    if (!debounced?.trim()) {
      setSuggestions([]); setOpen(false); setHighlight(-1); return;
    }
    fetchSuggestions(debounced);
  }, [debounced]);

  async function fetchSuggestions(term) {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q: term, page: "1", limit: String(limit),
        sortBy: "createdAt", sortOrder: "desc", searchIn: "name",
      });
      const res = await axios.get(`${API_BASE}/courses?${params.toString()}`);
      const payload = res.data;
      let list = payload?.data?.courses || payload?.data || payload?.courses || [];
      const normalized = list.map((c) => ({
        id: c.id || c._id,
        courseId: c.courseId || c.id || c._id,
        name: c.name || c.title || "Untitled Course",
        about: c.about || c.description || "",
        thumbnail: c.thumbnail || "",
        raw: c,
      }));
      setSuggestions(normalized);
      setOpen(true);
      setHighlight(normalized.length ? 0 : -1);
    } catch {
      setSuggestions([]); setOpen(false); setHighlight(-1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) { setOpen(false); setHighlight(-1); }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { setOpen(true); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min((h < 0 ? -1 : h) + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") {
      if (open && highlight >= 0 && suggestions[highlight]) { e.preventDefault(); selectSuggestion(suggestions[highlight]); }
      else { setOpen(false); onSubmitSearch?.(value.trim()); }
    } else if (e.key === "Escape") { setOpen(false); setHighlight(-1); }
  };

  const selectSuggestion = (sug) => { setOpen(false); setHighlight(-1); onSelectCourse?.(sug.raw); };

  const renderHighlighted = useMemo(() => {
    const term = debounced?.trim(); if (!term) return (txt) => txt;
    const re = new RegExp(`(${escapeRegExp(term)})`, "ig");
    return (txt) => String(txt).split(re).map((chunk, i) =>
      re.test(chunk) ? <mark key={i} className="bg-yellow-300/40 text-yellow-100 px-0.5 rounded">{chunk}</mark> : <span key={i}>{chunk}</span>
    );
  }, [debounced]);

  return (
    <div className="relative w-full" ref={boxRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            autoComplete="on"
            value={value}
            onChange={(e) => onChange(e.target.value)}   // realtime update
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length) setOpen(true); }}
            className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1621] px-4 text-[#e6edf3] placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />}
        </div>
        <button
          type="button"
          onClick={() => onSubmitSearch?.(value.trim())}
          className="h-12 px-4 rounded-lg bg-blue-600/80 text-white border border-blue-500/50 hover:bg-blue-500/80 transition-all"
        >
          Search
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-[#0b1220] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <ul role="listbox" aria-label="Course suggestions" className="max-h-96 overflow-auto">
            {suggestions.map((s, idx) => (
              <li
                key={s.id || idx}
                role="option"
                aria-selected={highlight === idx}
                onMouseEnter={() => setHighlight(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(s)}
                className={`flex gap-3 items-center p-3 cursor-pointer border-b border-white/5 last:border-0 ${highlight === idx ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-800">
                  {s.thumbnail ? <img src={s.thumbnail} alt={s.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full grid place-items-center text-white/40 text-lg">📚</div>}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{renderHighlighted(s.name)}</div>
                  {s.about && <div className="text-xs text-white/60 line-clamp-2">{renderHighlighted(s.about)}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function useDebouncedValue(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
