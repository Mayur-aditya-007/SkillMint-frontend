// src/components/SphereQuadMenu.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  TerminalSquare,
  CheckCircle2,
  StickyNote,
  Rocket,
} from "lucide-react";

const DRAG_THRESHOLD = 6; // px movement before we treat it as a drag

const SphereQuadMenu = ({
  sphereSize = 50, // center ball diameter
  chipSize = 60, // option chip size
  radius = 90, // expansion distance
  initialPosition = { x: 24, y: 100 },
  rememberPosition = true,
  storageKey = "sphereQuadMenu:pos",
  onAskAI = () => {},
  onReview = () => {},
  onQuickNotes = () => {},
}) => {
  const navigate = useNavigate();

  const rootRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, id: null });

  const [pos, setPos] = useState(initialPosition);

  // Restore saved position
  useEffect(() => {
    if (!rememberPosition) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) setPos(saved);
      }
    } catch {}
  }, [rememberPosition, storageKey]);

  // Keep inside viewport
  const clampToViewport = (x, y) => {
    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxX = Math.max(margin, vw - sphereSize - margin);
    const maxY = Math.max(margin, vh - sphereSize - margin);
    return {
      x: Math.min(Math.max(x, margin), maxX),
      y: Math.min(Math.max(y, margin), maxY),
    };
  };

  // Re-clamp on resize
  useEffect(() => {
    const onResize = () => {
      setPos((p) => {
        const c = clampToViewport(p.x, p.y);
        if (rememberPosition)
          localStorage.setItem(storageKey, JSON.stringify(c));
        return c;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [rememberPosition, storageKey, sphereSize]);

  // Root pointer handlers with drag threshold
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = rootRef.current;
    if (!el) return;

    isPointerDownRef.current = true;
    draggingRef.current = false;

    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      dx: e.clientX - pos.x,
      dy: e.clientY - pos.y,
      id: e.pointerId,
    };
  };

  const onPointerMove = (e) => {
    if (!isPointerDownRef.current) return;
    const { x: sx, y: sy, dx, dy, id } = startRef.current;
    const movedX = e.clientX - sx;
    const movedY = e.clientY - sy;
    const dist = Math.hypot(movedX, movedY);

    const el = rootRef.current;
    if (!draggingRef.current && dist >= DRAG_THRESHOLD) {
      draggingRef.current = true;
      el?.setPointerCapture?.(id);
      el && (el.style.zIndex = "10000");
      el && el.classList.add("dragging");
    }

    if (draggingRef.current) {
      const nx = e.clientX - dx;
      const ny = e.clientY - dy;
      setPos(clampToViewport(nx, ny));
    }
  };

  const onPointerUp = () => {
    const el = rootRef.current;
    if (draggingRef.current && el) {
      el.releasePointerCapture?.(startRef.current.id);
      el.classList.remove("dragging");
    }
    isPointerDownRef.current = false;
    draggingRef.current = false;

    if (rememberPosition) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(pos));
      } catch {}
    }
  };

  // Option definitions
  const options = [
    { label: "Ask AI", Icon: MessageSquare, onClick: onAskAI },
    { label: "Quick Terminal", Icon: TerminalSquare, onClick: () => navigate("/QuickTerminal") },
    { label: "Review", Icon: CheckCircle2, onClick: onReview },
    { label: "Quick Notes", Icon: StickyNote, onClick: onQuickNotes },
    { label: "Advanced", Icon: Rocket, onClick: () => navigate("/advanced-learning") },
  ];

  // Evenly spaced around circle
  const chips = useMemo(() => {
    const angleStep = (2 * Math.PI) / options.length;
    return options.map((opt, i) => {
      const angle = -Math.PI / 2 + i * angleStep; // start from top
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      return { ...opt, pos: [x, y] };
    });
  }, [radius, options]);

  return (
    <div
      ref={rootRef}
      className="fixed z-[9998] select-none group"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${sphereSize}px`,
        height: `${sphereSize}px`,
        cursor: draggingRef.current ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <style>{`.dragging { cursor: grabbing !important; }`}</style>

      <div className="relative w-full h-full">
        {/* Center sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/80 via-fuchsia-400/70 to-pink-400/80 shadow-lg border-2 border-white/30" />

        {/* Option chips */}
        {chips.map(({ label, Icon, pos, onClick }, idx) => (
          <button
            key={idx}
            type="button"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{
              width: `${chipSize}px`,
              height: `${chipSize}px`,
              ["--tx"]: `${pos[0]}px`,
              ["--ty"]: `${pos[1]}px`,
            }}
            onClick={(e) => {
              if (draggingRef.current) return;
              e.stopPropagation();
              onClick?.();
            }}
          >
            <div
              className="
                relative w-full h-full rounded-full overflow-hidden
                bg-white/10 border border-white/15 backdrop-blur-lg
                shadow-[0_4px_12px_rgba(0,0,0,0.25)]
                transition-[transform,opacity] duration-200
                opacity-0 [transform:translate(0,0)]
                group-hover:opacity-100 group-hover:[transform:translate(var(--tx),var(--ty))]
              "
            >
              <div className="relative z-10 h-full w-full grid place-items-center">
                <div className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-medium">{label}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SphereQuadMenu;
