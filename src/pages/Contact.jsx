import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer.jsx";
import SkillMintLogo from "../assets/SkillMint.png";
import MayurPhoto from "../assets/mayur.jpg";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const subject = encodeURIComponent(`Contact from SkillMint website — ${form.name || "Anonymous"}`);
      const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
      window.location.href = `mailto:mayuradityarawat@gmail.com?subject=${subject}&body=${body}`;
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={SkillMintLogo} alt="SkillMint" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold font-baskervville">SkillMint</span>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/about" className="hover:text-green-400 transition">About</Link>
            <Link to="/reviews" className="hover:text-green-400 transition">Reviews</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition">Get Started</Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4 flex flex-col gap-3">
            <Link to="/about" className="hover:text-green-400 transition" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/reviews" className="hover:text-green-400 transition" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition text-center" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </header>

      {/* Hero / Contact section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Contact card */}
          <motion.aside
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={MayurPhoto} alt="Mayur Aditya Rawat" className="h-36 w-36 rounded-full object-cover shadow-md" loading="lazy" />
            <h3 className="mt-4 text-xl font-bold">Mayur Aditya Rawat</h3>
            <p className="text-sm text-gray-500">Founder — SkillMint</p>

            <div className="mt-6 w-full text-left space-y-3">
              <a href="mailto:mayuradityarawat@gmail.com" className="flex items-center gap-3 hover:text-green-600 transition">
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-sm">mayuradityarawat@gmail.com</span>
              </a>
              <a href="tel:+918982691179" className="flex items-center gap-3 hover:text-green-600 transition">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-sm">+91 89826 91179</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-500">India</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap justify-center">
              <a href="https://github.com/Mayur-aditya-007/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/mayur-aditya-rawat-8a7210338" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://x.com/MayurAditya007" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/mayur_aditya_007" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.aside>

          {/* Middle: Contact form */}
          <motion.main
            className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="text-2xl font-bold">Get in touch</h2>
            <p className="mt-2 text-sm text-gray-500">
              Have a question, collab idea, or want to report an issue? Drop a message — I usually reply within 48 hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Your name</label>
                <input name="name" required value={form.name} onChange={handleChange} className="mt-2 w-full rounded-md border-gray-200 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Jane Doe" />
              </div>

              <div>
                <label className="text-sm font-medium">Your email</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="mt-2 w-full rounded-md border-gray-200 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="you@domain.com" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Message</label>
                <textarea name="message" required value={form.message} onChange={handleChange} rows={6} className="mt-2 w-full rounded-md border-gray-200 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="Tell me about your project..."></textarea>
              </div>

              <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-4">
                <button type="submit" disabled={loading} className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition disabled:opacity-60">
                  {loading ? "Sending..." : "Send message"}
                </button>
                {sent && <span className="text-sm text-green-600">Opened your mail client — complete the message to send.</span>}
              </div>
            </form>
          </motion.main>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
