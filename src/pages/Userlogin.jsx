// src/pages/UserLogin.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import loginBackground from "../assets/signupbackground.jpg"; // same bg you used earlier

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        { email, password }
      );

      const user = res.data?.user ?? null;
      const token = res.data?.token ?? null;

      if (user) setUser(user);
      if (token) localStorage.setItem("token", token);

      navigate("/home", { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      setErr(msg);
      console.error("LOGIN ERROR →", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
        {/* logo (optional) */}
      

        <h2 className="text-4xl font-bold text-center text-white mb-8">
          Welcome Back
        </h2>

        <form className="space-y-6" onSubmit={submitHandler} noValidate>
          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="block text-white font-medium mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 text-white/70 hover:text-white font-medium"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {err && (
            <p className="text-red-200 bg-red-500/20 border border-red-500/30 rounded-md p-2 text-sm">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:opacity-60 text-white font-bold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-center text-white/70 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-white underline">
            Create new account
          </Link>
        </p>

        {/* extra CTA (matches your original) */}
        
      </div>
    </div>
  );
}
