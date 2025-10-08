import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Quote, Check, Users, Star } from "lucide-react";
import Footer from "../components/Footer.jsx";
import SkillMintLogo from "../assets/SkillMint.png";

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Navbar */}
      <header className="bg-gray-900 text-white shadow sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={SkillMintLogo} alt="SkillMint" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold font-Baskervville">SkillMint</span>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/contact" className="hover:text-green-400 transition">Contact</Link>
            <Link to="/reviews" className="hover:text-green-400 transition">Reviews</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition">Get Started</Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4 flex flex-col gap-3">
            <Link to="/contact" className="hover:text-green-400 transition" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/reviews" className="hover:text-green-400 transition" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition text-center" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative w-full bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center h-[64vh] flex items-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto relative z-10 px-6">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-green-300 leading-tight">
              About <span className="text-white">SkillMint</span>
            </h1>
            <p className="mt-4 max-w-2xl text-gray-100 text-lg">
              A modern learning workspace that blends bite-sized lessons, hands-on projects and mentorship to help you build real skills — not just certificates.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/signup" className="px-5 py-3 bg-green-500 rounded-full font-semibold hover:bg-green-600 transition text-center">Join SkillMint</Link>
              <Link to="/start" className="px-5 py-3 border border-white/30 rounded-full text-white/90 hover:bg-white/5 transition text-center">Explore Courses</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission + Stats */}
      <section className="container mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <motion.div
            className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">Our mission</h2>
            <p className="mt-4 text-gray-600">
              SkillMint was built to close the gap between learning and doing. We focus on project-led learning, mentorship and job-ready tracks so learners can ship portfolio projects, demonstrate impact and get noticed by employers.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-semibold">Project-first</div>
                    <div className="text-sm text-gray-500">Hands-on milestones and real deliverables.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-semibold">Mentorship</div>
                    <div className="text-sm text-gray-500">Office hours, code reviews and career coaching.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-semibold">Verified Skills</div>
                    <div className="text-sm text-gray-500">Digital badges employers can verify.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Quote className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-semibold">Community</div>
                    <div className="text-sm text-gray-500">Peer projects, group critiques, study jams.</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.aside
            className="bg-gradient-to-b from-white to-green-50 p-6 rounded-2xl shadow-lg mt-6 lg:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">By the numbers</h3>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-extrabold text-green-500">1.2k+</div>
                  <div className="text-sm text-gray-500">Learners</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-green-500">85%</div>
                  <div className="text-sm text-gray-500">Job placement</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-green-500">150+</div>
                  <div className="text-sm text-gray-500">Projects shipped</div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* CTA Banner + Footer */}
      <section className="py-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-2xl font-bold">Ready to build something real?</h4>
            <p className="mt-1 text-sm">Start a free trial, join a cohort, or speak with a mentor today.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/signup" className="px-5 py-3 bg-white text-green-600 rounded-full font-semibold hover:opacity-95 transition">Create account</Link>
            <Link to="/contact" className="px-5 py-3 border border-white/30 rounded-full text-white hover:bg-white/10 transition">Talk to us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
