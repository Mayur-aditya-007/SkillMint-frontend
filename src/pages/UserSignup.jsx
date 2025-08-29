import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import signupBackground from "../assets/loginbackground.jpg";

export default function UserSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

    // Frontend validation
    if (!firstName || !lastName || !email || !password) {
      setErr("All fields are required.");
      return;
    }

    if (firstName.trim().length < 3) {
      setErr("First name must be at least 3 characters long.");
      return;
    }

    if (lastName.trim().length < 3) {
      setErr("Last name must be at least 3 characters long.");
      return;
    }

    if (password.length < 6) {
      setErr("Password must be at least 6 characters long.");
      return;
    }

    // ✅ Fixed: Match your backend's expected structure exactly
    const newUser = {
      fullname: {
        firstname: firstName.trim(), // ✅ lowercase 'firstname'
        lastname: lastName.trim(),   // ✅ lowercase 'lastname'
      },
      email: email.trim().toLowerCase(),
      password,
    };

    console.log("=== FRONTEND SIGNUP REQUEST ===");
    console.log("Sending data:", JSON.stringify(newUser, null, 2));
    console.log("URL:", `${import.meta.env.VITE_BASE_URL}/user/register`);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        newUser
      );

      console.log("=== SIGNUP SUCCESS ===");
      console.log("Response:", res.data);

      const user = res.data?.user ?? null;
      const token = res.data?.token ?? null;

      if (user) setUser(user);
      if (token) {
        localStorage.setItem("token", token);
        // Also set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      navigate("/home", { replace: true });

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("=== SIGNUP ERROR ===");
      console.error("Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message
      });

      // Handle different error types
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => err.msg || err.message).join(', ');
          setErr(`Validation failed: ${errorMessages}`);
        } 
        // Handle single error message
        else if (errorData.message) {
          setErr(errorData.message);
        }
        // Handle missing fields
        else if (errorData.missingFields) {
          setErr(`Missing required fields: ${errorData.missingFields.join(', ')}`);
        }
        else {
          setErr("Registration failed. Please try again.");
        }
      } else if (error?.message) {
        setErr(error.message);
      } else {
        setErr("Registration failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${signupBackground})` }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex items-center justify-between w-11/12 max-w-6xl">
        {/* Glass card */}
        <div className="w-[40%] min-w-[320px] p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Create Account
          </h2>

          <form className="space-y-5" onSubmit={submitHandler} noValidate>
            <div className="flex gap-4">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-1/2 p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
                minLength="3"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-1/2 p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
                minLength="3"
              />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {err && (
              <div className="text-red-200 bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm">
                <p className="font-medium">Registration Error:</p>
                <p>{err}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:opacity-60 text-white font-bold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-white/80 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-300 hover:underline">
                Login here
              </Link>
            </p>

            <p className="text-[10px] leading-tight text-white/70 text-center">
              This site is protected by reCAPTCHA and the{" "}
              <span className="underline">Google Privacy Policy</span> and{" "}
              <span className="underline">Terms of Service</span> apply.
            </p>
          </form>
        </div>

        {/* Right-side hero text */}
        <div className="hidden md:block w-[50%] text-white px-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to Skill Mint</h1>
          <p className="text-white/80 text-lg">
            A platform where you learn with the growing world.
          </p>
        </div>
      </div>
    </div>
  );
}