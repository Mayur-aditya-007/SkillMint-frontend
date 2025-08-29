// src/components/WebLLMChatModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f32_1-MLC";

export default function WebLLMChatModal({ open, onClose }) {
  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState("Initializing…");
  const [supported, setSupported] = useState(true);
  const [messages, setMessages] = useState([
    { role: "system", content: "You run entirely in the browser. Be concise and helpful." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const isStreamingRef = useRef(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load model on open
  useEffect(() => {
    if (!open) return;
    if (!("gpu" in navigator)) { setSupported(false); return; }
    (async () => {
      setEngine(null);
      setStatus("Loading model…");
      const eng = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (r) => setStatus(r.text),
      });
      setEngine(eng);
      setStatus("Ready");
      setTimeout(() => inputRef.current?.focus(), 50);
    })();
  }, [open]);

  // Auto scroll chat
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!engine || !text || isStreamingRef.current) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    isStreamingRef.current = true;

    try {
      const chunks = await engine.chat.completions.create({ messages: next, stream: true });
      let reply = "";
      for await (const c of chunks) {
        reply += c.choices?.[0]?.delta?.content || "";
        setMessages([...next, { role: "model", content: reply }]);
      }
    } finally {
      setLoading(false);
      isStreamingRef.current = false;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal shell */}
      <div className="absolute inset-x-0 top-10 mx-auto w-[96vw] max-w-3xl">
        <div
          className="
            relative overflow-hidden rounded-3xl border border-white/15
            bg-[rgba(17,24,39,0.85)] text-white shadow-[0_10px_60px_rgba(0,0,0,0.45)]
            backdrop-blur-xl
          "
        >
          {/* Animated neon ring (sphere vibe) */}
          <div className="pointer-events-none absolute -inset-[2px] rounded-[26px]">
            <div
              className="
                absolute -inset-[2px] rounded-[26px] opacity-40
                bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0%,#a78bfa_25%,#f472b6_50%,#22d3ee_100%)]
                animate-[spin_8s_linear_infinite]
              "
              style={{ maskImage: "linear-gradient(#000,transparent)", WebkitMaskImage: "linear-gradient(#000,transparent)" }}
            />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3 md:px-5 md:py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Sphere-like badge */}
              <div
                className="
                  relative w-10 h-10 md:w-12 md:h-12 rounded-full
                  bg-gradient-to-br from-cyan-400/80 via-fuchsia-400/70 to-pink-400/80
                  shadow-[0_8px_20px_rgba(0,0,0,0.35)] border border-white/30
                "
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold tracking-wide">SkillMint • Local AI</span>
                  <Sparkles className="w-4 h-4 text-cyan-300/90" />
                </div>
                <div className="text-xs text-white/60">
                  {supported ? status : "WebGPU not supported — try Chrome/Edge 113+."}
                </div>
              </div>
            </div>
            <button
              className="p-2 rounded-xl hover:bg-white/10 active:scale-95 transition"
              onClick={onClose}
              aria-label="Close"
            >
              <X />
            </button>
          </div>

          {/* Chat area */}
          <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto px-4 py-4 md:px-5 md:py-5 space-y-4">
            {messages
              .filter((m) => m.role !== "system")
              .map((m, i) => (
                <Bubble key={i} role={m.role} text={m.content} />
              ))}

            {loading && (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking…
              </div>
            )}
          </div>

          {/* Input / actions */}
          <div className="relative border-t border-white/10 p-3 md:p-4">
            {/* glowing underline */}
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask locally… (runs in your browser)"
                rows={1}
                className="
                  flex-1 resize-none rounded-2xl bg-white/10 border border-white/15
                  px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-400/40
                  placeholder:text-white/50
                "
              />

              <button
                onClick={send}
                disabled={!engine || loading || !input.trim()}
                className="
                  relative inline-flex items-center gap-2 rounded-2xl px-4 py-2.5
                  bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-pink-500
                  hover:opacity-95 active:scale-95 transition disabled:opacity-50
                  shadow-[0_8px_24px_rgba(236,72,153,0.35)]
                "
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {/* tiny suggestion chips */}
              {["Explain closures in JS", "Fix my React state bug", "What is Big-O?"].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(s)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/8 border border-white/10 hover:bg-white/12"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes (scope to this component) */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ============== Message bubble ============== */
function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          relative max-w-[80%] md:max-w-[75%] rounded-2xl p-3 md:p-3.5
          ${isUser
            ? "bg-gradient-to-br from-indigo-500/80 to-purple-500/80 border border-white/20"
            : "bg-white/8 border border-white/12"}
          backdrop-blur-md
        `}
      >
        <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          <b>{isUser ? "You" : "AI"}</b>
        </div>
        <div className="whitespace-pre-wrap leading-relaxed text-sm">{text}</div>

        {/* subtle glow edge like the sphere */}
        <span
          className="
            pointer-events-none absolute -inset-px rounded-2xl opacity-25
            bg-[radial-gradient(60%_80%_at_50%_-20%,rgba(34,211,238,0.8)_0%,transparent_60%)]
          "
        />
      </div>
    </div>
  );
}
