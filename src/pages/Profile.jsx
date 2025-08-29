// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MasonryGrid from "../components/MasonryGrid";
import TileCard from "../components/TileCard";

export default function Profile() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("posts"); // 'posts' | 'courses' | 'about'
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      setLoading(true);
      setErr("");
      try {
        // ⚠️ Replace with your real API endpoint
        // const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${userId}`);
        // const data = await res.json();

        // --- demo fallback data ---
        const data = {
          _id: userId,
          cover:
            "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1920&auto=format&fit=crop",
          avatar: "/default-avatar.png",
          fullname: { firstName: "Alex", lastName: "Johnson" },
          handle: "@alex.codes",
          email: "alex@example.com",
          role: "Frontend Developer",
          location: "Bangalore, India",
          bio:
            "Frontend dev. React, TypeScript, and design systems. Learning in public.",
          skills: ["React", "TypeScript", "Next.js", "Tailwind", "UI/UX"],
          stats: {
            followers: 1240,
            following: 187,
            posts: 42,
            communityPoints: 980,
          },
          mutuals: [
            { id: "m1", name: "Priya", avatar: "/default-avatar.png" },
            { id: "m2", name: "Sam", avatar: "/default-avatar.png" },
            { id: "m3", name: "Neha", avatar: "/default-avatar.png" },
          ],
          posts: [
            {
              id: "po1",
              title: "Dashboard UI in Tailwind",
              about: "Glassmorphism dashboard layout.",
              image:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
            },
            {
              id: "po2",
              title: "Card Components",
              about: "Reusable card system with tokens.",
              image:
                "https://images.unsplash.com/photo-1517245386807-9b491b0f0d2c?q=80&w=1200&auto=format&fit=crop",
            },
            {
              id: "po3",
              title: "Form Patterns",
              about: "Accessible forms + validation.",
              image:
                "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1200&auto=format&fit=crop",
            },
          ],
          courses: [
            {
              id: "c1",
              title: "Advanced React Patterns",
              about: "Render props, hooks, context, composition.",
              image:
                "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
              progress: 65,
            },
            {
              id: "c2",
              title: "TypeScript for React Devs",
              about: "Types, generics, utility types.",
              image:
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
              progress: 20,
            },
          ],
          about: {
            headline: "Clean UI. Strong UX. Performant Frontends.",
            experience: [
              { where: "Freelance", role: "Frontend Dev", years: "2022–Now" },
              { where: "DesignCo", role: "UI Engineer", years: "2020–2022" },
            ],
            links: [
              { label: "GitHub", url: "https://github.com/" },
              { label: "LinkedIn", url: "https://linkedin.com/" },
              { label: "Website", url: "#" },
            ],
          },
        };
        // --- end demo ---

        if (!isMounted) return;
        setUser(data);
        setLoading(false);
      } catch (e) {
        if (!isMounted) return;
        setErr("Failed to load profile.");
        setLoading(false);
      }
    }

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const name = useMemo(
    () =>
      `${user?.fullname?.firstName || ""} ${user?.fullname?.lastName || ""}`.trim() ||
      "User",
    [user]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* loading / error */}
      {loading && <PageLoader />}
      {!loading && err && <ErrorBanner message={err} />}

      {!loading && user && (
        <>
          {/* Cover + avatar + actions */}
          <section className="mt-16 relative">
            <div
              className="h-56 md:h-72 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${user.cover})` }}
            >
              <div className="w-full h-full bg-black/40" />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-20 relative z-10">
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-end gap-5">
                <img
                  src={user.avatar}
                  alt={name}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-white/20 object-cover"
                />

                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {name}
                  </h1>
                  <p className="text-gray-300 text-sm">{user.handle}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge>{user.role}</Badge>
                    <Badge>{user.location}</Badge>
                  </div>

                  {/* Mutuals */}
                  {user.mutuals?.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-gray-400">Mutuals:</span>
                      {user.mutuals.slice(0, 3).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          title={m.name}
                          className="w-6 h-6 rounded-full border border-white/20"
                        />
                      ))}
                      {user.mutuals.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{user.mutuals.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <PrimaryButton onClick={() => setIsFollowing((v) => !v)}>
                    {isFollowing ? "Following" : "Follow"}
                  </PrimaryButton>
                  <GhostButton>Message</GhostButton>
                  <GhostButton>Share</GhostButton>
                </div>
              </div>
            </div>
          </section>

          {/* Stats + Tabs */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatPill value={user.stats.followers} label="Followers" />
              <StatPill value={user.stats.following} label="Following" />
              <StatPill value={user.stats.posts} label="Posts" />
              <StatPill value={user.stats.communityPoints} label="Community Pts" />
            </div>

            {/* Tabs */}
            <div className="mt-6 bg-white/10 border border-white/10 rounded-2xl p-2 flex gap-2">
              <Tab active={tab === "posts"} onClick={() => setTab("posts")}>
                Posts
              </Tab>
              <Tab active={tab === "courses"} onClick={() => setTab("courses")}>
                Courses
              </Tab>
              <Tab active={tab === "about"} onClick={() => setTab("about")}>
                About
              </Tab>
            </div>
          </div>

          {/* Tab content */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {tab === "posts" && (
              <SectionCard title="Posts">
                {user.posts?.length ? (
                  <MasonryGrid>
                    {user.posts.map((p) => (
                      <TileCard
                        key={p.id}
                        image={p.image}
                        title={p.title}
                        subtitle={p.about}
                      />
                    ))}
                  </MasonryGrid>
                ) : (
                  <EmptyState text="No posts yet." />
                )}
              </SectionCard>
            )}

            {tab === "courses" && (
              <SectionCard title="Courses">
                {user.courses?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.courses.map((c) => (
                      <CourseCard key={c.id} course={c} />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No courses to show." />
                )}
              </SectionCard>
            )}

            {tab === "about" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SectionCard title="Bio">
                  <p className="text-gray-200">{user.bio}</p>
                </SectionCard>

                <SectionCard title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Links">
                  <ul className="space-y-2">
                    {user.about?.links?.map((l, i) => (
                      <li key={i}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title="Experience" className="lg:col-span-3">
                  {user.about?.experience?.length ? (
                    <ul className="space-y-3">
                      {user.about.experience.map((e, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4"
                        >
                          <div>
                            <p className="font-semibold">{e.role}</p>
                            <p className="text-sm text-gray-300">{e.where}</p>
                          </div>
                          <span className="text-sm text-gray-400">{e.years}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState text="No experience added." />
                  )}
                </SectionCard>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- small building blocks ---------------- */

function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-white/5 rounded-2xl" />
          <div className="h-10 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-28 bg-white/5 rounded-2xl" />
            <div className="h-28 bg-white/5 rounded-2xl" />
            <div className="h-28 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="mt-20 max-w-3xl mx-auto bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl">
      {message}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm">
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm"
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 text-sm"
    >
      {children}
    </button>
  );
}

function StatPill({ value, label }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-300 text-xs mt-1">{label}</div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm ${
        active
          ? "bg-white/20 border border-white/20"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function SectionCard({ title, children, className = "" }) {
  return (
    <section
      className={`bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5 ${className}`}
    >
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      {children}
    </section>
  );
}

function EmptyState({ text }) {
  return <p className="text-gray-300 text-sm">{text}</p>;
}

function CourseCard({ course }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
      <div className="h-36 relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-300 mt-1">{course.about}</p>
        <div className="mt-3 bg-white/20 h-2 rounded-full">
          <div
            className="h-2 bg-indigo-500 rounded-full"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{course.progress}% complete</p>
      </div>
    </div>
  );
}
