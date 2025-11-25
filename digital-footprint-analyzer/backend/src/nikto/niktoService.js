const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const resultsDir = "/app/nikto-results";

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

exports.runNiktoScan = (target) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outFile = path.join(resultsDir, `nikto_${timestamp}.json`);

    const cmd = `
      nikto -h ${target} \
        -Format json \
        -output ${outFile} \
        -nointeractive \
        -Display V \
        -maxtime 60s
    `;

    exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Nikto error:", stderr || error);
        return reject({ error: "Scan failed", details: stderr || error });
      }

      // Read JSON output
      try {
        const json = fs.readFileSync(outFile, "utf8");
        const parsed = JSON.parse(json);
        resolve(parsed);
      } catch (err) {
        reject({ error: "Failed to parse Nikto output", details: err.message });
      }
    });
  });
};
