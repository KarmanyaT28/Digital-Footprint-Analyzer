import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form.email, form.password);

    if (res.error) return setError(res.error);

    alert("✅ Login successful (TEMP — before adding Google Authenticator)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1f] text-white">
      <div className="bg-[#11182a] p-10 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-400 mb-3">{error}</p>}

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

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
