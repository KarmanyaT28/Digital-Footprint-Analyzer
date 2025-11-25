import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Setup2FA from "./pages/Setup2FA";
import Dashboard from "./pages/Dashboard";


import NiktoScan from "./pages/NiktoScan";




function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-extrabold tracking-wide mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        Digital Footprint Visualizer
      </h1>

      <p className="text-gray-300 max-w-xl text-center mb-10 leading-relaxed">
        Discover, analyze, and secure your organization’s externally facing
        digital assets under a Zero Trust security model.
      </p>

      <div className="flex gap-5">
        <Link
          to="/login"
          className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all shadow-lg shadow-blue-800/40"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-all shadow-lg shadow-emerald-800/40"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup-2fa" element={<Setup2FA />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nikto" element={<NiktoScan />} />
        {/* fallback to home so router never fails */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
