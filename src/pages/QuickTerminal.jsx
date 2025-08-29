// src/pages/QuickTerminal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Pin,
  PinOff,
  ExternalLink,
  Search,
  SortAsc,
  SortDesc,
  Code2,
  Bookmark,
} from "lucide-react";

/* ---------- Logo sources & helpers ---------- */
// SimpleIcons primary (colored SVG), then Devicon fallback, then neutral glyph
const SI = (slug) => `https://cdn.simpleicons.org/${slug}`;
const DEVICON = (slug, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
const NEUTRAL = SI("code");

// Build a fallback list for a language/tool
const logoChain = (primarySlug, deviconSlug = null, variant = "original") => {
  const chain = [SI(primarySlug)];
  if (deviconSlug) chain.push(DEVICON(deviconSlug, variant));
  chain.push(NEUTRAL);
  return chain;
};

/* ---------- Data (with logo chains) ---------- */
const COMPILERS = [
  { name: "C (GCC)", url: "https://www.onlinegdb.com/online_c_compiler", logos: logoChain("c", "c") },
  { name: "C++ (GCC)", url: "https://www.onlinegdb.com/online_c++_compiler", logos: logoChain("cplusplus", "cplusplus") },
  { name: "Java", url: "https://www.onlinegdb.com/online_java_compiler", logos: logoChain("java", "java") },
  { name: "Python", url: "https://www.programiz.com/python-programming/online-compiler/", logos: logoChain("python", "python") },
  { name: "JavaScript", url: "https://playcode.io/", logos: logoChain("javascript", "javascript") },
  { name: "TypeScript", url: "https://www.typescriptlang.org/play", logos: logoChain("typescript", "typescript") },
  { name: "C#", url: "https://dotnetfiddle.net/", logos: logoChain("csharp", "cs") },
  { name: "PHP", url: "https://www.mycompiler.io/new/php", logos: logoChain("php", "php") },
  { name: "Ruby", url: "https://repl.it/languages/ruby", logos: logoChain("ruby", "ruby") },
  { name: "Go (Golang)", url: "https://play.golang.org/", logos: logoChain("go", "go") },
  { name: "Rust", url: "https://play.rust-lang.org/", logos: logoChain("rust", "rust", "plain") },
  { name: "Kotlin", url: "https://play.kotlinlang.org/", logos: logoChain("kotlin", "kotlin") },
  { name: "Swift", url: "https://swiftfiddle.com/", logos: logoChain("swift", "swift") },
  { name: "Scala", url: "https://scastie.scala-lang.org/", logos: logoChain("scala", "scala") },
  { name: "R", url: "https://rdrr.io/snippets/", logos: logoChain("r", "r") },
  { name: "Perl", url: "https://www.tutorialspoint.com/execute_perl_online.php", logos: logoChain("perl", "perl") },
  { name: "Haskell", url: "https://replit.com/languages/haskell", logos: logoChain("haskell", "haskell") },
  { name: "Lua", url: "https://www.lua.org/demo.html", logos: logoChain("lua", "lua") },
  { name: "Dart", url: "https://dartpad.dev/", logos: logoChain("dart", "dart") },
  { name: "HTML/CSS/JS", url: "https://jsfiddle.net/", logos: logoChain("html5", "html5") },
  { name: "Julia", url: "https://repl.it/languages/julia", logos: logoChain("julia", "julia") },
  { name: "Elixir", url: "https://replit.com/languages/elixir", logos: logoChain("elixir", "elixir") },
  { name: "Erlang", url: "https://www.tutorialspoint.com/execute_erlang_online.php", logos: logoChain("erlang", "erlang") },
  // Scheme/Lisp & Prolog don't have SimpleIcons/Devicon consistently — fall back to neutral gracefully
  { name: "Scheme/Lisp", url: "https://replit.com/languages/scheme", logos: [SI("scheme"), DEVICON("lisp", "original"), NEUTRAL] },
  { name: "F#", url: "https://repl.it/languages/fsharp", logos: logoChain("fsharp", "fsharp") },
  { name: "OCaml", url: "https://try.ocamlpro.com/", logos: logoChain("ocaml", "ocaml") },
  { name: "Prolog", url: "https://swish.swi-prolog.org/", logos: [SI("prolog"), NEUTRAL] },
  { name: "Fortran", url: "https://www.onlinegdb.com/online_fortran_compiler", logos: [SI("fortran"), DEVICON("fortran"), NEUTRAL] },
  { name: "SQL", url: "https://sqliteonline.com/", logos: logoChain("sqlite", "sqlite") },
  { name: "Markdown", url: "https://dillinger.io/", logos: logoChain("markdown", "markdown") },
  { name: "XML/JSON Validator", url: "https://jsonformatter.org/xml-formatter", logos: [SI("json"), NEUTRAL] },
];

const PINS_KEY = "quickterminal:pins";

/* ---------- Small <img> wrapper with multi-source fallback + fade-in ---------- */
function LogoImage({ sources = [], alt }) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const src = sources[idx] || NEUTRAL;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(false);
        setIdx((i) => (i + 1 < sources.length ? i + 1 : i)); // advance to next source if any
      }}
      className="w-full h-36 object-contain p-6 transition-opacity duration-200"
      style={{ opacity: loaded ? 1 : 0 }}
    />
  );
}

/* ============================= Page ============================= */
export default function QuickTerminal() {
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState("asc");
  const [pinned, setPinned] = useState(() => {
    try {
      const raw = localStorage.getItem(PINS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist pins
  useEffect(() => {
    try {
      localStorage.setItem(PINS_KEY, JSON.stringify(pinned));
    } catch {}
  }, [pinned]);

  const pinnedNames = useMemo(() => new Set(pinned.map((p) => p.name)), [pinned]);

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    const base = COMPILERS.filter((c) => c.name.toLowerCase().includes(t));
    base.sort((a, b) =>
      sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return base;
  }, [term, sort]);

  const pinnedSorted = useMemo(() => {
    const arr = [...pinned];
    arr.sort((a, b) =>
      sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return arr;
  }, [pinned, sort]);

  const pin = (item) => {
    if (!pinnedNames.has(item.name)) setPinned((prev) => [...prev, item]);
  };
  const unpin = (item) => setPinned((prev) => prev.filter((p) => p.name !== item.name));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Spacer for fixed navbar height */}
      <div className="h-20 md:h-24" />

      {/* Centered container — now 60vw on large screens */}
      <div className="mx-auto w-[90vw] md:w-[80vw] lg:w-[60vw] pb-10">
        {/* Header & controls */}
        <div className="px-4 md:px-0 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/10">
              <Code2 className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Quick Terminal</h1>
              <p className="text-white/70 text-sm">Pin and launch online compilers.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search compilers…"
                className="w-full sm:w-72 bg-white/10 border border-white/10 rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
            </label>

            <button
              onClick={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-2"
              title={sort === "asc" ? "Sort Z → A" : "Sort A → Z"}
            >
              {sort === "asc" ? (
                <>
                  <SortAsc className="w-4 h-4" /> <span>A → Z</span>
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4" /> <span>Z → A</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pinned */}
        {pinnedSorted.length > 0 && (
          <section className="mt-6 px-4 md:px-0">
            <div className="flex items-center gap-2 mb-3">
              <Bookmark className="w-4 h-4 text-amber-300" />
              <h2 className="text-lg font-semibold">Pinned</h2>
            </div>

            <Masonry>
              {pinnedSorted.map((c) => (
                <MasonryItem key={`p-${c.name}`}>
                  <Card title={c.name} logos={c.logos}>
                    <Actions href={c.url}>
                      <UnpinButton onClick={() => unpin(c)} />
                    </Actions>
                  </Card>
                </MasonryItem>
              ))}
            </Masonry>
          </section>
        )}

        {/* Available */}
        <section className="mt-8 px-4 md:px-0">
          <h2 className="text-lg font-semibold mb-3">Available Compilers</h2>

          <Masonry>
            {filtered.map((c) => {
              const alreadyPinned = pinnedNames.has(c.name);
              return (
                <MasonryItem key={c.name}>
                  <Card title={c.name} logos={c.logos}>
                    <Actions href={c.url}>
                      {alreadyPinned ? (
                        <UnpinButton onClick={() => unpin(c)} />
                      ) : (
                        <PinButton onClick={() => pin(c)} />
                      )}
                    </Actions>
                  </Card>
                </MasonryItem>
              );
            })}
          </Masonry>

          {filtered.length === 0 && (
            <div className="mt-6 text-white/60 text-sm">No compilers match “{term}”.</div>
          )}
        </section>
      </div>

      {/* Masonry CSS (Pinterest-like) */}
      <style>{`
        .qm-masonry { column-gap: 1rem; column-count: 1; }
        @media (min-width: 640px) { .qm-masonry { column-count: 2; } }
        @media (min-width: 1024px) { .qm-masonry { column-count: 3; } }
        .qm-item { break-inside: avoid; margin-bottom: 1rem; }
      `}</style>
    </div>
  );
}

/* ---------- Masonry helpers ---------- */
function Masonry({ children }) {
  return <div className="qm-masonry">{children}</div>;
}
function MasonryItem({ children }) {
  return <div className="qm-item">{children}</div>;
}

/* ---------- UI blocks ---------- */
function Card({ title, logos = [], children }) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:bg-white/12 transition shadow-md">
      {/* Logo panel with multi-source fallback + fade-in */}
      <div className="relative grid place-items-center bg-black/20">
        <LogoImage sources={logos} alt={title} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold leading-tight">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function Actions({ href, children }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      <OpenLink href={href} />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function OpenLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 text-sm"
      title="Open in new tab"
    >
      <ExternalLink className="w-4 h-4" />
      Open
    </a>
  );
}

function PinButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500"
      title="Pin"
    >
      <Pin className="w-4 h-4" />
      Pin
    </button>
  );
}

function UnpinButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500"
      title="Unpin"
    >
      <PinOff className="w-4 h-4" />
      Unpin
    </button>
  );
}
