import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import Footer from "../components/Footer.jsx";
import SkillMintLogo from "../assets/SkillMint.png";
import frontvideo from "../assets/front.mp4"; // reuse your existing hero video

const API = import.meta.env.VITE_BASE_URL || "";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/reviews`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr("Couldn't load reviews right now.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // duplicate list for seamless loop
  const looped = useMemo(() => {
    if (!reviews.length) return [];
    return [...reviews, ...reviews];
  }, [reviews]);

  const linkBase =
    "text-sm md:text-base hover:text-green-400 transition-colors duration-200";
  const isActive = (path) =>
    location.pathname === path ? "text-green-400" : "text-white";

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      {/* Navbar — matches Start page layout & tone */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={SkillMintLogo}
              alt="SkillMint"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold font-baskervville">
              SkillMint
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/about" className={`${linkBase} ${isActive("/about")}`}>
              About
            </Link>
            <Link
              to="/contact"
              className={`${linkBase} ${isActive("/contact")}`}
            >
              Contact
            </Link>
            <Link
              to="/reviews"
              className={`${linkBase} ${isActive("/reviews")}`}
            >
              Reviews
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-500 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-500 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile burger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="text-2xl"
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4 flex flex-col gap-3">
            <Link
              to="/about"
              className={`${linkBase} ${isActive("/about")}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`${linkBase} ${isActive("/contact")}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/reviews"
              className={`${linkBase} ${isActive("/reviews")}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-500 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-500 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="container mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Your words guide our roadmap
        </h1>
        <p className="mt-3 text-white/70 max-w-3xl">
          We read every review, celebrate the love, and fix what’s missing.
          Thanks for helping us build SkillMint better for everyone.
        </p>
      </header>

      {/* Two-panel layout */}
      <main className="container mx-auto px-4 pb-12 grow">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* LEFT: media + message */}
          <section className="order-1 md:order-none">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
              {/* Prefer video if supported; otherwise image will show as fallback poster (small trick) */}
              <video
                className="w-full h-64 md:h-[46vh] object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1600&auto=format&fit=crop"
              >
                <source src={frontvideo} type="video/mp4" />
              </video>
              {/* soft overlay title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-lg md:text-xl font-semibold">
                  Built with our community
                </h2>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-gray-900 p-5">
              <h3 className="text-xl font-bold">We truly value your reviews</h3>
              <p className="mt-2 text-white/80 leading-relaxed">
                Every comment, star, and suggestion influences our design,
                courses, and support. Reviews aren’t just feedback—they’re a
                partnership. Keep them coming, and we’ll keep improving.
              </p>
              <ul className="mt-4 space-y-2 text-white/70 list-disc list-inside">
                <li>We read 100% of reviews.</li>
                <li>Feature requests are tracked and prioritized.</li>
                <li>Critical issues trigger immediate action.</li>
              </ul>
            </div>
          </section>

          {/* RIGHT: reviews (exactly half screen on desktop) */}
          <section className="order-2 md:order-none">
            <div className="relative h-[60vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
              {/* Top/Bottom fade masks */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gray-950 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-950 to-transparent" />

              {/* Loading / Error states */}
              {loading && (
                <div className="absolute inset-0 grid place-items-center text-white/70">
                  Loading reviews…
                </div>
              )}
              {!loading && err && (
                <div className="absolute inset-0 grid place-items-center text-red-300">
                  {err}
                </div>
              )}

              {/* Auto-scrolling list on the RIGHT side */}
              {!loading && !err && reviews.length > 0 && (
                <div className="absolute inset-0 will-change-transform animate-[scrollUp_28s_linear_infinite]">
                  <ul className="py-6 flex flex-col gap-4">
                    {looped.map((rv, i) => (
                      <li
                        key={`${rv.id || i}-${i}`}
                        className="mx-4"
                        style={{
                          animation: `fadeInUp 600ms ease-out both`,
                          animationDelay: `${(i % reviews.length) * 120}ms`,
                        }}
                      >
                        <ReviewCard
                          name={rv?.user?.name || "Anonymous"}
                          rating={rv?.rating || 0}
                          text={rv?.text || ""}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!loading && !err && reviews.length === 0 && (
                <div className="absolute inset-0 grid place-items-center text-white/70">
                  Be the first to leave a review!
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Subtle animations, on-theme */}
      <style>{`
        @keyframes fadeInUp {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}

/** Single review card — darker, low-contrast, on-theme */
function ReviewCard({ name, rating = 0, text = "" }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gray-800/70 p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{name}</h3>
          <p className="mt-2 text-white/80 leading-relaxed">{text}</p>
        </div>
        <Stars rating={rating} />
      </div>
    </div>
  );
}

function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      {Array.from({ length: 5 }).map((_, idx) => {
        const active = idx < rating;
        return (
          <Star
            key={idx}
            className={`w-5 h-5 ${
              active ? "text-amber-300" : "text-white/30"
            }`}
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
          />
        );
      })}
    </div>
  );
}
