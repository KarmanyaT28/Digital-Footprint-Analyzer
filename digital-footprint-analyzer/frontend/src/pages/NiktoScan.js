import React, { useState } from "react";
import { runNiktoScan } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NiktoScan() {
  const navigate = useNavigate();
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleScan = async () => {
    if (!target.trim()) return;

    setLoading(true);
    setResults(null);

    const res = await runNiktoScan(target);
    setLoading(false);
    setResults(res);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white p-10">

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold text-cyan-400 tracking-wide">
          Nikto Vulnerability Scanner
        </h1>

        {/* BACK TO DASHBOARD BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-sm font-semibold shadow-md transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Scan Form */}
      <div className="bg-[#111827] p-8 rounded-xl max-w-2xl shadow-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-5 text-gray-200">
          Start a Nikto Scan
        </h2>

        <input
          type="text"
          placeholder="Enter URL or Domain (e.g., https://example.com)"
          className="w-full p-4 rounded-lg bg-[#1b2338] border border-gray-700 text-gray-200 placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <button
          onClick={handleScan}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold tracking-wide shadow-lg transition"
        >
          {loading ? "Running Scan…" : "Start Scan"}
        </button>

        {loading && (
          <p className="text-gray-400 mt-4 animate-pulse">
            Running Nikto Scan… this may take a few seconds.
          </p>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-cyan-300 mb-6">Scan Results</h2>

          {/* Error */}
          {results.success === false && (
            <p className="text-red-400 font-semibold">{results.error}</p>
          )}

          {/* Success Results */}
          {results.success &&
            results.results.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111827] p-8 rounded-xl mb-8 border border-gray-800 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                  {item.host} ({item.ip})
                </h3>
                <p className="text-gray-400 mb-4">Port: {item.port}</p>

                <h4 className="text-xl font-semibold mb-3 text-gray-200">
                  Vulnerabilities Detected:
                </h4>

                {item.vulnerabilities.length === 0 && (
                  <p className="text-gray-500">No vulnerabilities reported.</p>
                )}

                {item.vulnerabilities.map((v, i) => (
                  <div
                    key={i}
                    className="bg-[#1b2338] p-5 rounded-lg mb-4 border border-gray-700 hover:border-cyan-400 transition"
                  >
                    <p className="text-red-400 font-bold">{v.msg}</p>
                    <p className="text-gray-400 text-sm mt-2">URL: {v.url}</p>
                    <p className="text-gray-500 text-sm">Method: {v.method}</p>
                    <a
                      href={v.references}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline text-sm mt-2 inline-block"
                    >
                      Reference
                    </a>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
