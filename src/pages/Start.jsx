import React, { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import SkillMintLogo from "../assets/SkillMint.png";
import frontvideo from "../assets/front.mp4";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

// Lazy load Features Section
const FeaturesSection = lazy(() => import("../components/FeaturesSection.jsx"));

export default function Start() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const text = "Experience Learning Like Never Before";

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Preload hero video asynchronously
  useEffect(() => {
    const video = document.createElement("video");
    video.src = frontvideo;
    video.preload = "auto";
    video.oncanplaythrough = () => setVideoLoaded(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={SkillMintLogo} alt="SkillMint" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold font-Baskervville">SkillMint</span>
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/about" className="hover:text-green-500 transition">About</Link>
            <Link to="/contact" className="hover:text-green-500 transition">Contact</Link>
            <Link to="/reviews" className="hover:text-green-500 transition">Reviews</Link>
            <Link to="/login" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition">Sign Up</Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl">☰</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4 flex flex-col gap-3">
            <Link to="/about" className="hover:text-green-500 transition">About</Link>
            <Link to="/contact" className="hover:text-green-500 transition">Contact</Link>
            <Link to="/reviews" className="hover:text-green-500 transition">Reviews</Link>
            <Link to="/login" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition text-center">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition text-center">Sign Up</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen">
        {!videoLoaded && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
            <LoadingSpinner size={48} message="Loading video..." />
          </div>
        )}

        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
          autoPlay
          loop
          muted
          preload="auto"
        >
          <source src={frontvideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-y-0 left-0 flex items-center justify-start pl-16">
          <div className="bg-black/60 p-8 rounded-2xl max-w-lg text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 mb-4">
              {displayText}<span className="animate-pulse">|</span>
            </h1>
            <p className="text-lg text-gray-200">Learn, Grow, and Succeed with SkillMint.</p>
            <Link to="/signup" className="mt-6 inline-block px-6 py-3 bg-green-500 rounded-full font-semibold hover:bg-green-600 transition">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Lazy-loaded Features */}
      <Suspense fallback={<LoadingSpinner message="Loading features..." />}>
        <FeaturesSection />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
