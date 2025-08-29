// src/pages/MyProfile.jsx
import React, { useContext, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import EditProfileModal from "../components/EditProfileModal";
import { UserContext } from "../context/UserContext";

export default function MyProfile() {
  const { user } = useContext(UserContext) || {};
  const [editOpen, setEditOpen] = useState(false);

  // ---- shape real user data safely (no crashes if something is missing)
  const me = useMemo(() => {
    const first = user?.fullname?.firstname ?? user?.firstname ?? "";
    const last  = user?.fullname?.lastname  ?? user?.lastname  ?? "";
    const name  = [first, last].filter(Boolean).join(" ") || "User";

    const enrolledCourses = Array.isArray(user?.enrolledCourses) ? user.enrolledCourses : [];
    const coursesEnrolled  = enrolledCourses.length;
    const coursesCompleted = enrolledCourses.filter(c => c.isCompleted).length;

    // learningStreak/communityPoints may not exist; derive or default
    const learningStreak   = user?.stats?.learningStreak ?? 0;
    const communityPoints  = user?.stats?.communityPoints ?? user?.points ?? 0;

    return {
      cover:
        user?.cover ||
        "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1920&auto=format&fit=crop",
      avatar: user?.avatar || "/default-avatar.png",
      name,
      handle: user?.handle || (user?.email ? `@${user.email.split("@")[0]}` : ""),
      email: user?.email || "",
      role: user?.role || "Member",
      location: user?.location || "—",
      bio: user?.bio || "This learner hasn’t written a bio yet.",
      skills: Array.isArray(user?.skills) ? user.skills : [],
      goals: Array.isArray(user?.goals) ? user.goals : [],
      socials: Array.isArray(user?.socials) ? user.socials : [],
      stats: {
        learningStreak,
        coursesEnrolled,
        coursesCompleted,
        communityPoints,
      },
      enrolled: enrolledCourses,          // [{courseId, courseName, progress, isCompleted, ...}]
      featured: Array.isArray(user?.featured) ? user.featured : [],
      activity: Array.isArray(user?.activity) ? user.activity : [],
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* cover + avatar header */}
      <section className="mt-16 relative">
        <div
          className="h-56 md:h-72 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${me.cover})` }}
        >
          <div className="w-full h-full bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-20 relative z-10">
          <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-end gap-5">
            <img
              src={me.avatar}
              alt={me.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-white/20 object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {me.name}
              </h1>
              {me.handle && <p className="text-gray-300 text-sm">{me.handle}</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {me.role && me.role !== "—" && <Badge>{me.role}</Badge>}
                {me.location && me.location !== "—" && <Badge>{me.location}</Badge>}
                {me.email && <Badge subtle>{me.email}</Badge>}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <GhostButton onClick={() => setEditOpen(true)}>Edit Profile</GhostButton>
              <PrimaryButton onClick={() => navigator.share?.({ title: me.name })}>
                Share
              </PrimaryButton>
              <GhostButton onClick={() => (window.location.href = "/settings")}>
                Settings
              </GhostButton>
            </div>
          </div>
        </div>
      </section>

      {/* page content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column */}
        <div className="space-y-6">
          <Card title="About">
            <p className="text-gray-200 leading-relaxed">{me.bio}</p>
          </Card>

          <Card title="Skills">
            {me.skills.length === 0 ? (
              <p className="text-gray-300 text-sm">Add your skills from Edit Profile.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {me.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </Card>

          <Card title="Learning Goals">
            {me.goals.length === 0 ? (
              <p className="text-gray-300 text-sm">Set your learning goals from Edit Profile.</p>
            ) : (
              <ul className="space-y-2">
                {me.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-[6px] w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-gray-200">{g}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {me.socials.length > 0 && (
            <Card title="Socials">
              <ul className="space-y-2">
                {me.socials.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* middle column */}
        <div className="space-y-6">
          <StatsGrid stats={me.stats} />

          <Card title="Enrolled Courses">
            {me.enrolled.length === 0 ? (
              <p className="text-gray-300 text-sm">No courses yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {me.enrolled.map((c) => (
                  <CourseMini key={c.courseId || c._id || c.id} course={c} />
                ))}
              </div>
            )}
          </Card>

          {me.featured.length > 0 && (
            <Card title="Featured Projects">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {me.featured.map((p) => (
                  <FeaturedCard key={p.id || p._id} project={p} />
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* right column */}
        <div className="space-y-6">
          <Card title="Activity">
            {me.activity.length === 0 ? (
              <p className="text-gray-300 text-sm">No recent activity.</p>
            ) : (
              <ul className="space-y-3">
                {me.activity.map((a, i) => (
                  <li key={a.id || a._id || i} className="flex items-start gap-3">
                    <span className="mt-[6px] w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-sm text-gray-200">{a.text || a.title || "Activity"}</p>
                      {(a.when || a.time) && (
                        <p className="text-xs text-gray-400 mt-1">{a.when || a.time}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Contact">
            <div className="space-y-2 text-sm">
              {me.email && <Row label="Email" value={me.email} />}
              {me.location && me.location !== "—" && <Row label="Location" value={me.location} />}
              {me.role && <Row label="Role" value={me.role} />}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editOpen}
        initial={user}
        onClose={(ok) => {
          setEditOpen(false);
          // simplest refresh to reflect new avatar/name; replace with context refresh if available
          if (ok) window.location.reload();
        }}
      />
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Card({ title, children }) {
  return (
    <section className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      {children}
    </section>
  );
}

function Badge({ children, subtle }) {
  return (
    <span
      className={`px-3 py-1 rounded-full ${
        subtle ? "bg-white/5" : "bg-white/10"
      } border border-white/10 text-sm`}
    >
      {children}
    </span>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 md:px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 text-sm"
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 md:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm"
    >
      {children}
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/10 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  );
}

function StatsGrid({ stats }) {
  const items = [
    { label: "Learning Streak", value: stats.learningStreak ?? 0, suffix: "days" },
    { label: "Enrolled", value: stats.coursesEnrolled ?? 0 },
    { label: "Completed", value: stats.coursesCompleted ?? 0 },
    { label: "Community Pts", value: stats.communityPoints ?? 0 },
  ];
  return (
    <Card title="Stats">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold">
              {it.value}
              {it.suffix ? <span className="text-base ml-1">{it.suffix}</span> : null}
            </div>
            <div className="text-gray-300 text-xs mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CourseMini({ course }) {
  const title = course.courseName || course.title || "Course";
  const progress = typeof course.progress === "number" ? course.progress : 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 bg-white/20 h-2 rounded-full">
        <div
          className="h-2 bg-indigo-500 rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
      <p className="text-sm text-gray-300 mt-2">{progress}% complete</p>
      {/* If you have a course route, use it here */}
      <button
        className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm"
        onClick={() => {
          const id = course.courseId || course._id || course.id;
          if (id) window.location.href = `/courses/${id}`;
        }}
      >
        Continue
      </button>
    </div>
  );
}

function FeaturedCard({ project }) {
  const title = project.title || "Project";
  const cover =
    project.cover ||
    "https://images.unsplash.com/photo-1517245386807-9b491b0f0d2c?q=80&w=1200&auto=format&fit=crop";
  const blurb = project.blurb || "";
  const link = project.link || "#";

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition"
    >
      <div className="relative h-40">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-4">
        <h4 className="font-semibold">{title}</h4>
        {blurb && <p className="text-sm text-gray-300 mt-1">{blurb}</p>}
      </div>
    </a>
  );
}
