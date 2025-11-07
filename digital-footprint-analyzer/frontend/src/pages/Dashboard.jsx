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
    <div className="min-h-screen bg-[#0a0f1f] text-white flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-cyan-400 mb-10 tracking-wide">
          ZeroTrust Console
        </h1>

        <nav className="space-y-3 text-gray-300">
          <button className="w-full text-left py-2 px-3 rounded bg-[#1f2937] border border-cyan-700 text-cyan-300">
            Dashboard
          </button>
          <button className="w-full text-left py-2 px-3 rounded hover:bg-[#1f2937] transition">
            Assets
          </button>
          <button className="w-full text-left py-2 px-3 rounded hover:bg-[#1f2937] transition">
            Analytics
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-500 transition py-2 rounded-lg font-semibold mt-6"
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
            <h2 className="text-3xl font-bold">Welcome, {user?.email}</h2>
            <p className="text-gray-400">
              Monitor and secure your exposed digital assets
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 transition px-6 py-2 rounded-lg font-semibold shadow-xl shadow-blue-900/40"
          >
            + Add Asset
          </button>
        </div>

        {/* ASSET GRID */}
        <h3 className="text-xl font-semibold mb-4">Assets</h3>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : assets.length === 0 ? (
          <p className="text-gray-500">No assets found. Add your first asset.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset._id}
                className="bg-[#111827] p-6 rounded-xl border border-gray-800 hover:border-cyan-400 transition"
              >
                <h4 className="text-lg font-semibold text-cyan-400">
                  {asset.type.toUpperCase()}
                </h4>
                <p className="text-gray-300 mt-2">Risk Score: {asset.riskScore}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Last Seen: {new Date(asset.lastSeenAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ADD ASSET MODAL */}
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
