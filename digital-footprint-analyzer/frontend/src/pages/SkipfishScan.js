import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SkipfishScan() {
  const navigate = useNavigate();
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);

  const stages = [
    "Discovering directories…",
    "Running recursive crawler…",
    "Collecting HTTP responses…",
    "Analyzing attack surfaces…",
    "Generating HTML report…"
  ];

  const handleScan = async () => {
    if (!target.trim()) return;

    setLoading(true);
    setLogs([]);
    setResults(null);

    // Show staged logs
    let index = 0;
    const interval = setInterval(() => {
      if (index < stages.length) {
        setLogs((prev) => [...prev, stages[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      const res = await fetch(
        `http://localhost:5001/api/skipfish/scan?target=${encodeURIComponent(target)}`
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Skipfish scan failed");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({ success: false, error: err.message || "Failed to reach Skipfish API" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold text-cyan-400">
          Skipfish Web Analyzer
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg font-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Scan Form */}
      <div className="bg-[#111827] p-8 rounded-xl max-w-2xl shadow-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-5 text-gray-200">Start a Skipfish Scan</h2>

        <input
          type="text"
          placeholder="Enter URL or Domain"
          className="w-full p-4 rounded-lg bg-[#1b2338] border border-gray-700 outline-none"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <button
          onClick={handleScan}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold"
        >
          {loading ? "Running Scan…" : "Start Scan"}
        </button>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="mt-8 bg-black p-5 rounded-lg max-w-3xl">
          {logs.map((log, i) => (
            <p key={i} className="text-green-300 text-sm">
              ✔ {log}
            </p>
          ))}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-cyan-300 mb-6">Scan Results</h2>

          {!results.success && (
            <p className="text-red-400 font-semibold">{results.error}</p>
          )}

          {results.success && results.results && (
            <div className="bg-[#111827] p-8 rounded-xl border border-gray-800 shadow-lg">
              <p className="text-xl font-semibold text-cyan-300">Report Generated</p>
              <p className="text-gray-400 mt-2">Scan Target: {results.results.target}</p>

              <a
                href={`http://localhost:5001/skipfish-results/${results.results.folder}/${results.results.report}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline mt-3 inline-block"
              >
                Open Skipfish HTML Report
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
