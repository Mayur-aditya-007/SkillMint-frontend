import React, { useEffect, useState } from "react";
import { CheckCircle2, Plus, Trash2, Edit3, PanelRightOpen } from "lucide-react";

const uuid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

export default function TodoDock({ storageKey = "todos" }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  }, [items, storageKey]);

  const add = () => {
    if (!text.trim()) return;
    setItems([{ id: uuid(), text: text.trim(), done: false }, ...items]);
    setText("");
  };
  const toggle = (id) =>
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id) => setItems(items.filter((i) => i.id !== id));
  const startEdit = (i) => {
    setEditing(i.id);
    setText(i.text);
  };
  const saveEdit = () => {
    setItems(items.map((i) => (i.id === editing ? { ...i, text: text.trim() } : i)));
    setEditing(null);
    setText("");
  };

  return (
    <>
      {/* Toggle (futuristic glow) */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Open To-Do"
        className="fixed right-4 top-1/3 z-[10000] rounded-full p-3
                   bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-violet-600
                   shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]
                   focus:outline-none"
      >
        <PanelRightOpen className="w-5 h-5 text-white" />
      </button>

      {/* Dock */}
      <aside
        className={`fixed top-0 right-0 h-full w-[320px] bg-slate-950/95 border-l border-white/10 backdrop-blur-xl z-[9999]
                    transform transition-transform duration-300 ${
                      open ? "translate-x-0" : "translate-x-full"
                    }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" /> To-Do
            </h3>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              Close
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={editing ? "Edit task" : "Add a new task"}
              className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2"
            />
            {editing ? (
              <button
                onClick={saveEdit}
                className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500"
              >
                Save
              </button>
            ) : (
              <button
                onClick={add}
                className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 inline-flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            )}
          </div>

          <ul className="mt-4 space-y-2">
            {items.map((i) => (
              <li
                key={i.id}
                className="group flex items-center gap-2 p-2 rounded border border-white/10 bg-white/5"
              >
                <input
                  type="checkbox"
                  checked={i.done}
                  onChange={() => toggle(i.id)}
                  className="accent-emerald-500"
                />
                <span className={`flex-1 ${i.done ? "line-through text-white/50" : ""}`}>
                  {i.text}
                </span>
                <button
                  onClick={() => startEdit(i)}
                  className="p-1 rounded bg-white/10 hover:bg-white/20"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(i.id)}
                  className="p-1 rounded bg-white/10 hover:bg-white/20"
                >
                  <Trash2 className="w-4 h-4 text-rose-300" />
                </button>
              </li>
            ))}
            {items.length === 0 && <li className="text-white/60 text-sm">No tasks yet.</li>}
          </ul>
        </div>
      </aside>
    </>
  );
}
