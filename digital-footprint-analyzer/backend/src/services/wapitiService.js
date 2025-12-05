const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const runWapitiScan = (target) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputDir = path.join(__dirname, "../../wapiti-results");

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outputFile = path.join(outputDir, `wapiti-${timestamp}.json`);

    const cmd = `wapiti -u "${target}" -f json -o "${outputFile}"`;

    exec(cmd, { timeout: 200000 }, (error) => {
      if (error) {
        console.error("Wapiti Exec Error:", error);
        return reject(new Error("Wapiti scan failed or target unreachable."));
      }

      fs.readFile(outputFile, "utf8", (err, data) => {
        if (err) return reject(err);

        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (parseError) {
          return reject(new Error("Failed to parse Wapiti JSON output."));
        }

        resolve({
          file: `wapiti-${timestamp}.json`,
          vulnerabilities: parsed?.vulnerabilities || [],
          summary: parsed?.info || parsed,
        });
      });
    });
  });
};

module.exports = { runWapitiScan };
