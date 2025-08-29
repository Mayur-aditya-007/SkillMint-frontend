import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import SkillMintLogo from "../assets/SkillMint.png";
import frontvideo from "../assets/front.mp4";

export default function Start() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Typewriter effect logic
  const text = "Experience Learning Like Never Before";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
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
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/about" className="hover:text-green-500 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-green-500 transition">
              Contact
            </Link>
            {/* NEW Reviews link styled like About/Contact */}
            <Link to="/reviews" className="hover:text-green-500 transition">
              Reviews
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition"
            >
              Sign Up
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl"
            >
              ☰
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4 flex flex-col gap-3">
            <Link to="/about" className="hover:text-green-500 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-green-500 transition">
              Contact
            </Link>
            <Link to="/reviews" className="hover:text-green-500 transition">
              Reviews
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition text-center"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition text-center"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      {/* Section 1: Fullscreen Video with Typewriter on Left */}
      <section className="relative w-full h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src={frontvideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Typewriter Text on Left */}
        <div className="absolute inset-y-0 left-0 flex items-center justify-start pl-16">
          <div className="bg-black/60 p-8 rounded-2xl max-w-lg text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 mb-4">
              {displayText}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-lg text-gray-200">
              Learn, Grow, and Succeed with SkillMint.
            </p>
            <Link
              to="/signup"
              className="mt-6 inline-block px-6 py-3 bg-green-500 rounded-full font-semibold hover:bg-green-600 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Features Grid */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-12">Our Core Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">
                Interactive Learning
              </h3>
              <p>Engage with hands-on projects and real-world scenarios.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Expert Instructors</h3>
              <p>Learn from industry professionals with years of experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">
                Flexible Learning Paths
              </h3>
              <p>Choose courses that fit your schedule and career goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Parallax Banner */}
      <section
        className="relative w-full h-screen bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl text-white font-bold px-4 text-center">
            Innovative Courses for Future Leaders
          </h2>
        </div>
      </section>

      {/* Section 4: Hero with Animated Text */}
      <section className="relative w-full h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-white flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1506748686210-2d5e7b2c6c1b?auto=format&fit=crop&w=1600&q=80")',
          }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-pulse">
            Unlock Your Potential with SkillMint
          </h1>
          <p className="text-lg md:text-2xl mb-6 animate-fadeIn">
            Master in-demand skills and advance your career.
          </p>
          <Link
            to="/signup"
            className="px-6 py-3 bg-green-500 rounded-full text-lg font-semibold hover:bg-green-600 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
