const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const NiktoResult = require("../models/NiktoResult");

const resultsDir = path.join(__dirname, "../../nikto-results");

// Ensure directory exists
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

async function runNiktoScan(target) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputFile = path.join(resultsDir, `nikto_${timestamp}.json`);

    const cmd = `nikto -h ${target} -Format json -o ${outputFile}`;

    exec(cmd, async (err, stdout, stderr) => {
      if (err) return reject(`Nikto failed: ${stderr}`);

      fs.readFile(outputFile, "utf8", async (err, data) => {
        if (err) return reject("Could not read JSON output");

        const parsed = JSON.parse(data);

        const result = await NiktoResult.create({
          target,
          findings: parsed.vulnerabilities || [],
          raw: parsed
        });

        resolve(result);
      });
    });
  });
}

module.exports = { runNiktoScan };
