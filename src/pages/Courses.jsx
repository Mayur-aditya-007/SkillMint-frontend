// src/pages/Courses.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import {
  Film,
  PlayCircle,
  BadgeCheck,
  BookOpen,
  Link as LinkIcon,
  ClipboardList,
  FileText,
  Mic2,
  Users,
  MessageCircleMore,
  CalendarClock,
  Layers,
  ArrowLeft,
  Lightbulb,       // ⬅️ NEW
} from "lucide-react";

/** --- helpers for video embedding --- */
function getEmbedUrl(rawUrl = "") {
  try {
    const u = new URL(rawUrl);

    // YouTube
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.split("/")[1];
        return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
      }
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      return rawUrl;
    }

    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://player.vimeo.com/video/${id}` : rawUrl;
    }

    // Google Drive
    if (u.hostname.includes("drive.google.com")) {
      const match = u.pathname.match(/\/file\/d\/([^/]+)\//);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return rawUrl;
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export default function Courses() {
  const { id } = useParams(); // /courses/:id
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLecture, setActiveLecture] = useState(null); // index

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/courses/${id}`);
        const payload = data?.data ?? data;
        if (mounted) setCourse(payload);
      } catch (e) {
        console.error("[course] load failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Fully shaped meta with safe defaults
  const meta = useMemo(() => {
    if (!course) {
      return {
        title: "Loading...",
        poster:
          "https://images.unsplash.com/photo-1523246196365-68f4f3b4fe2a?q=80&w=1920&auto=format&fit=crop",
        about: "",
        category: "general",
        level: "beginner",
        createdAt: null,
        lectures: [],
        requirements: [],
        resources: { books: [], cheatsheets: [], links: [] },
        assignments: [],
        tests: [],
        viva: [],
        expertUrl: "",
        chatUrl: "",
        id,
      };
    }
    const res = course.resources && typeof course.resources === "object" ? course.resources : {};
    return {
      title: course.name || "Untitled Course",
      poster:
        course.thumbnail ||
        "https://images.unsplash.com/photo-1523246196365-68f4f3b4fe2a?q=80&w=1920&auto=format&fit=crop",
      about: course.about || "",
      category: course.category || "general",
      level: course.level || "beginner",
      createdAt: course.createdAt ? new Date(course.createdAt) : null,
      lectures: Array.isArray(course.lectures) ? course.lectures : [],
      requirements: Array.isArray(course.requirements) ? course.requirements : [],
      resources: {
        books: Array.isArray(res.books) ? res.books : [],
        cheatsheets: Array.isArray(res.cheatsheets) ? res.cheatsheets : [],
        links: Array.isArray(res.links) ? res.links : [],
      },
      assignments: Array.isArray(course.assignments) ? course.assignments : [],
      tests: Array.isArray(course.tests) ? course.tests : [],
      viva: Array.isArray(course.viva) ? course.viva : [],
      expertUrl: course?.expertConnection?.requestUrl || "",
      chatUrl: course?.chatRoom?.url || "",
      id: course.id || course._id || course.courseId || id,
    };
  }, [course, id]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1); // restore prev page state
    } else {
      navigate("/explore");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="mt-16" />

      {/* HERO with overlay back arrow */}
      <section className="relative">
        <div className="relative h-[260px] md:h-[360px] w-full overflow-hidden">
          <img
            src={meta.poster}
            alt={meta.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay below button */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
          {/* Dark glassmorphic back arrow */}
          <button
            onClick={handleBack}
            aria-label="Back to Explore"
            className="absolute left-4 top-4 z-20 inline-flex items-center justify-center
                       rounded-full p-2 md:p-3
                       bg-black/40 border border-white/20 backdrop-blur-md
                       shadow-lg hover:bg-black/50 active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow" />
            <span className="sr-only">Back</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-7">
            <div className="flex items-start gap-4">
              <div className="hidden md:block w-28 h-36 rounded-xl overflow-hidden border border-white/20 shadow-lg">
                <img
                  src={meta.poster}
                  alt={meta.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Film className="w-6 h-6 text-indigo-300" />
                  <span className="truncate">{meta.title}</span>
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
                  <Badge icon={<Layers className="w-3.5 h-3.5" />}>{meta.category}</Badge>
                  <Badge icon={<BadgeCheck className="w-3.5 h-3.5" />}>{meta.level}</Badge>
                  {meta.createdAt && (
                    <Badge icon={<CalendarClock className="w-3.5 h-3.5" />}>
                      {meta.createdAt.toLocaleDateString()}
                    </Badge>
                  )}
                </div>

                {meta.about && (
                  <p className="mt-3 text-white/90 leading-relaxed line-clamp-3">
                    {meta.about}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  {/* Start Learning plays first lecture */}
                  <button
                    onClick={() => setActiveLecture(0)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg"
                    disabled={meta.lectures.length === 0}
                    title={meta.lectures.length === 0 ? "No lectures available" : "Start Learning"}
                  >
                    <PlayCircle className="w-5 h-5" />
                    {meta.lectures.length > 0 ? "Start Learning" : "Overview"}
                  </button>

                  {meta.expertUrl && (
                    <a
                      href={meta.expertUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/10"
                    >
                      <Users className="w-5 h-5" />
                      Expert Connect
                    </a>
                  )}
                  {meta.chatUrl && (
                    <a
                      href={meta.chatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/10"
                    >
                      <MessageCircleMore className="w-5 h-5" />
                      Course Chat
                    </a>
                  )}

                  {/* 🌟 Futuristic glowing Lightbulb → Advanced Learning */}
                  <button
                    onClick={() => navigate("/advanced-learning")}
                    className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                               bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-600
                               text-white shadow-[0_0_20px_rgba(99,102,241,0.45)]
                               hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]
                               transition transform hover:-translate-y-0.5 active:translate-y-0
                               focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
                    title="Jump to Advanced Learning"
                  >
                    {/* glow halo */}
                    <span className="absolute inset-0 -z-10 blur-xl opacity-60 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-600 rounded-xl animate-pulse" />
                    {/* subtle ping dot */}
                    <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-amber-300 animate-ping" />
                    <Lightbulb className="w-5 h-5 drop-shadow" />
                    Advanced Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          {meta.about && (
            <Card title="Overview" icon={<BookOpen className="w-5 h-5 text-indigo-300" />}>
              <p className="text-white/90 leading-7">{meta.about}</p>
            </Card>
          )}

          {/* Active Lecture Player */}
          {activeLecture !== null && meta.lectures[activeLecture] && (
            <Card
              title={`Now Playing: ${meta.lectures[activeLecture].title || `Lecture ${activeLecture + 1}`}`}
              icon={<PlayCircle className="w-5 h-5 text-emerald-300" />}
            >
              <div className="relative pt-[56.25%] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <iframe
                  src={getEmbedUrl(meta.lectures[activeLecture].videoUrl)}
                  title={meta.lectures[activeLecture].title || `Lecture ${activeLecture + 1}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Card>
          )}

          {/* Lectures List */}
          {meta.lectures.length > 0 && (
            <Card
              title={`Lectures (${meta.lectures.length})`}
              icon={<PlayCircle className="w-5 h-5 text-emerald-300" />}
            >
              <ul className="divide-y divide-white/10">
                {meta.lectures.map((lec, i) => (
                  <li
                    key={i}
                    className={`py-3 flex items-start gap-3 px-2 cursor-pointer rounded-lg hover:bg-white/5 ${
                      i === activeLecture ? "bg-white/5" : ""
                    }`}
                    onClick={() => setActiveLecture(i)}
                  >
                    <div className="mt-0.5">
                      <PlayCircle className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{lec.title || `Lecture ${i + 1}`}</div>
                      {lec.videoUrl && (
                        <div className="text-xs text-white/60 break-all">{lec.videoUrl}</div>
                      )}
                      {i === activeLecture && (
                        <span className="text-xs text-indigo-300">Now Playing</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements */}
          {meta.requirements.length > 0 && (
            <Card title="Requirements" icon={<BadgeCheck className="w-5 h-5 text-violet-300" />}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meta.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-300" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Resources */}
          {(meta.resources.links.length +
            meta.resources.books.length +
            meta.resources.cheatsheets.length) > 0 && (
            <Card title="Resources" icon={<LinkIcon className="w-5 h-5 text-sky-300" />}>
              <SectionList label="Links" items={meta.resources.links} isLink />
              <SectionList label="Books" items={meta.resources.books} />
              <SectionList label="Cheatsheets" items={meta.resources.cheatsheets} isLink />
            </Card>
          )}

          {/* Assignments / Tests / Viva */}
          {meta.assignments.length > 0 && (
            <Card title="Assignments" icon={<ClipboardList className="w-5 h-5 text-amber-300" />}>
              <BulletList items={meta.assignments} dot="bg-amber-300" />
            </Card>
          )}
          {meta.tests.length > 0 && (
            <Card title="Tests" icon={<FileText className="w-5 h-5 text-rose-300" />}>
              <BulletList items={meta.tests} dot="bg-rose-300" />
            </Card>
          )}
          {meta.viva.length > 0 && (
            <Card title="Viva" icon={<Mic2 className="w-5 h-5 text-emerald-300" />}>
              <BulletList items={meta.viva} dot="bg-emerald-300" />
            </Card>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <Card title="Course Info">
            <InfoRow label="Category" value={meta.category} />
            <InfoRow label="Level" value={meta.level} />
            <InfoRow label="Lectures" value={String(meta.lectures.length)} />
            {meta.createdAt && (
              <InfoRow label="Published" value={meta.createdAt.toLocaleDateString()} />
            )}
          </Card>
        </aside>
      </div>

      {loading && (
        <div className="fixed inset-0 grid place-items-center bg-black/30 backdrop-blur-sm z-[999]">
          <div className="w-6 h-6 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/* ---------- UI helpers ---------- */
function Card({ title, icon, children }) {
  return (
    <section className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5">
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}

function Badge({ children, icon }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs">
      {icon}
      {children}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/10 last:border-0">
      <span className="text-white/60 text-sm">{label}</span>
      <span className="text-white text-sm">{value}</span>
    </div>
  );
}

function BulletList({ items = [], dot = "bg-white/50" }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className={`mt-2 w-1.5 h-1.5 rounded-full ${dot}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionList({ label, items = [], isLink = false }) {
  if (!items?.length) return null;
  return (
    <div className="mb-3">
      <div className="text-white/80 text-sm mb-2">{label}</div>
      <div className="space-y-1.5">
        {items.map((x, i) =>
          isLink ? (
            <div key={i}>
              <a
                href={x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 break-all"
              >
                {x}
              </a>
            </div>
          ) : (
            <div key={i} className="text-white/90">
              {x}
            </div>
          )
        )}
      </div>
    </div>
  );
}
