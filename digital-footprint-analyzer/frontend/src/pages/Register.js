import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm)
      return setError("Passwords do not match");

    // ✅ Register user and receive QR code from backend
    const res = await registerUser(form.email, form.password);

    if (res.error) return setError(res.error);
    if (!res.qrImage) return setError("Failed to retrieve QR Code. Try again.");

    // ✅ Redirect to QR setup screen
    navigate("/setup-2fa", { state: { qrImage: res.qrImage } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1f] text-white">
      <div className="bg-[#11182a] p-10 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {error && <p className="text-red-400 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-[#1b2338] outline-none"
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#1b2338] outline-none"
            onChange={handleChange}
          />
          <input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded bg-[#1b2338] outline-none"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg transition font-semibold"
          >
            Register & Generate QR
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
