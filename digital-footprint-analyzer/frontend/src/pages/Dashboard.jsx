import React, { useEffect, useState } from "react";
import { getAssets } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      const data = await getAssets();
      setAssets(data.assets || []);
      setLoading(false);
    }

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-[#050b16] text-white">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0c1220] border-r border-cyan-900/40 p-6 flex flex-col shadow-xl shadow-black/50">
        <h1 className="text-2xl font-bold text-cyan-400 mb-10 tracking-wide">
          ZeroTrust Console
        </h1>

        {/* Section Title */}
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
          Attack Surface Scanners
        </p>

        <nav className="space-y-3 text-gray-300 font-medium">
          <button
            onClick={() => navigate("/nikto")}
            className="w-full text-left py-2 px-3 rounded hover:bg-cyan-800/30 transition border hover:border-cyan-700"
          >
            Nikto Vulnerability Scan
          </button>

          <button
            onClick={() => navigate("/wapiti")}
            className="w-full text-left py-2 px-3 rounded hover:bg-cyan-800/30 transition border hover:border-cyan-700"
          >
            Wapiti Web Vulnerability Scan
          </button>

          <button
            onClick={() => navigate("/skipfish")}
            className="w-full text-left py-2 px-3 rounded hover:bg-cyan-800/30 transition border hover:border-cyan-700"
          >
            Skipfish Recon Scan
          </button>

          <button
            onClick={() => navigate("/w3af")}
            className="w-full text-left py-2 px-3 rounded hover:bg-cyan-800/30 transition border hover:border-cyan-700"
          >
            W3AF Web App Audit
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-500 transition py-2 rounded-lg font-semibold shadow-lg shadow-red-900/40"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-cyan-300 drop-shadow-md">
              Welcome, {user?.email}
            </h2>
            <p className="text-gray-400 mt-1">
              Monitor, scan, and secure your exposed digital assets.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-lg font-semibold shadow-lg shadow-blue-900/40"
          >
            + Add Asset
          </button>
        </div>

        {/* ASSETS GRID */}
        <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
          Assets Overview
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading assets...</p>
        ) : assets.length === 0 ? (
          <p className="text-gray-500">No assets added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <div
                key={asset._id}
                className="bg-[#0c1220] p-6 rounded-xl border border-cyan-900/30 shadow-lg shadow-black/40 hover:border-cyan-400 transition"
              >
                <h4 className="text-xl font-semibold text-cyan-400 tracking-wide">
                  {asset.type.toUpperCase()}
                </h4>

                <div className="mt-4 space-y-2">
                  <p className="text-gray-300">
                    <span className="font-semibold">Risk Score:</span>{" "}
                    {asset.riskScore}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Last Seen:{" "}
                    {new Date(asset.lastSeenAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] p-8 rounded-xl w-[400px] border border-cyan-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Add New Asset
            </h2>

            <p className="text-gray-400 mb-6 text-sm">
              (Next Step: This form will submit to backend & auto-scan assets)
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-lg mt-4 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
