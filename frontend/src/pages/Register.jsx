// frontend/src/pages/Register.jsx

import { useState } from "react";
//import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

// This page allows new users to register
function Register() {
  // --- STATE VARIABLES ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(""); // Your state for confirm

  // 🎯 FIX #1: Corrected typos. ('succes' -> 'success', 'setSucces' -> 'setSuccess')
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // This function runs when the form is submitted
  const handleRegisters = async (e) => {
    e.preventDefault(); // Stop page reload
    setError(""); // Clear old errors
    setSuccess(""); // 🎯 FIX #2: Use the correct setter 'setSuccess'

    // --- Frontend Validation ---
    // 🎯 FIX #3: Added '!confirm' to the validation check
    if (!name || !email || !password || !confirm) {
      return setError("Please fill all fields");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirm) {
      return setError("Password do not match");
    }
    // --- End Validation ---

    try {
      // --- Call the Backend API ---
      const res = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // --- Handle Success ---
      // 🎯 FIX #4: Use the correct setter 'setSuccess'
      setSuccess(res.data.message + ". Redirecting to login...");
      setError("");

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      // --- Handle Errors ---
      // 🎯 FIX #5: Use the correct setter 'setSuccess' & typo fix
      setError(err.response?.data?.message || "Registration failed.");
      setSuccess("");
    }
  };

  // --- THE UI (Your styling is perfect) ---
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-slate-800/70 backdrop-blur-lg border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Your Account</h2>

        {/* 🎯 FIX #6: The button is now INSIDE the form */}
        <form onSubmit={handleRegisters}>
          {/* Name Field Group */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Rahul M"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Field Group */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password Field Group */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="•••••••• (Min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Confirm Password Field Group */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              Create Account
            </button>
          </div>

          {/* Error/Success Messages */}
          {/* 🎯 FIX #7: Use the correct state variable 'success' */}
          {error && <p className="text-center mt-4 text-red-400">{error}</p>}
          {success && <p className="text-center mt-4 text-green-400">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;