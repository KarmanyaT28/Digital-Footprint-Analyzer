import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", totp: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await loginUser(form.email, form.password, form.totp);

    if (res.error) return setError(res.error || "Authentication failed.");

    // ✅ Save JWT
    if (res.access) {
      localStorage.setItem("access_token", res.access);
    }

    // ✅ Save User object (very important for Dashboard)
    if (res.user) {
      localStorage.setItem("user", JSON.stringify(res.user));
    }

    // ✅ Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1f] text-white">
      <div className="bg-[#11182a] p-10 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>

        {error && <p className="text-red-400 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-[#1b2338] outline-none"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#1b2338] outline-none"
            onChange={handleChange}
            required
          />

          <input
            name="totp"
            type="text"
            maxLength="6"
            placeholder="6-digit Authenticator Code"
            className="w-full p-3 rounded bg-[#1b2338] outline-none tracking-widest text-center text-lg"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg transition font-semibold"
          >
            Login Securely
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
