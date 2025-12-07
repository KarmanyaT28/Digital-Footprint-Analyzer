// const { spawn } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const runSkipfishScan = (target) => {
//   return new Promise((resolve, reject) => {
//     if (!target || !target.trim()) return reject(new Error("Invalid target URL."));

//     const timestamp = Date.now();
//     const resultsDir = path.resolve(__dirname, "../../skipfish-results");

//     if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

//     const folderName = `skipfish-${timestamp}`;
//     const folderPath = path.join(resultsDir, folderName);

//     const dockerCmd = `docker run --rm -v "${resultsDir}:/data" -w /opt/skipfish skipfish-image ./skipfish -o "/data/${folderName}" "${target}"`;

//     const docker = spawn(dockerCmd, { shell: true });

//     let stdout = "";
//     let stderr = "";

//     docker.stdout.on("data", (data) => (stdout += data.toString()));
//     docker.stderr.on("data", (data) => (stderr += data.toString()));

//     docker.on("close", (code) => {
//       if (code !== 0) {
//         console.error("Skipfish Docker Failed with code", code);
//         console.error("STDOUT:", stdout);
//         console.error("STDERR:", stderr);
//         return reject(new Error("Skipfish scan failed inside Docker. Check backend logs."));
//       }

//       resolve({
//         success: true,
//         folder: folderName,
//         path: folderPath,
//         report: "index.html",
//         target,
//       });
//     });

//     docker.on("error", (err) => {
//       console.error("Failed to start Docker process:", err);
//       console.error("STDOUT:", stdout);
//       console.error("STDERR:", stderr);
//       reject(new Error("Failed to start Docker process for Skipfish."));
//     });
//   });
// };

// module.exports = { runSkipfishScan };



const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Use a host path that Docker Desktop can access
const HOST_RESULTS_DIR = "/tmp/skipfish-results";

const runSkipfishScan = (target) => {
  return new Promise((resolve, reject) => {
    if (!target || !target.trim()) {
      return reject(new Error("Invalid target URL."));
    }

    // Ensure host results directory exists
    if (!fs.existsSync(HOST_RESULTS_DIR)) {
      fs.mkdirSync(HOST_RESULTS_DIR, { recursive: true });
    }

    const timestamp = Date.now();
    const folderName = `skipfish-${timestamp}`;
    const folderPath = path.join(HOST_RESULTS_DIR, folderName);

    // Docker command: mount host directory to /data inside Skipfish container
    const dockerCmd = `docker run --rm \
      -v "${HOST_RESULTS_DIR}:/data" \
      -w /opt/skipfish \
      skipfish-image \
      ./skipfish -o "/data/${folderName}" "${target}"`;

    const docker = spawn(dockerCmd, { shell: true });

    let stdout = "";
    let stderr = "";

    docker.stdout.on("data", (data) => (stdout += data.toString()));
    docker.stderr.on("data", (data) => (stderr += data.toString()));

    docker.on("close", (code) => {
      if (code !== 0) {
        console.error("Skipfish Docker Failed with code", code);
        console.error("STDOUT:", stdout);
        console.error("STDERR:", stderr);
        return reject(
          new Error("Skipfish scan failed inside Docker. Check backend logs.")
        );
      }

      resolve({
        success: true,
        folder: folderName,
        path: folderPath,
        report: "index.html",
        target,
      });
    });

    docker.on("error", (err) => {
      console.error("Failed to start Docker process:", err);
      console.error("STDOUT:", stdout);
      console.error("STDERR:", stderr);
      reject(new Error("Failed to start Docker process for Skipfish."));
    });
  });
};

module.exports = { runSkipfishScan };
