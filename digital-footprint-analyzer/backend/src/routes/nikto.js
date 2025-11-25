const express = require("express");
const router = express.Router();
const { runNiktoScan } = require("../nikto/niktoService");

router.get("/scan", async (req, res) => {
  const target = req.query.target;

  if (!target)
    return res.status(400).json({ error: "Target URL is required ?target=" });

  try {
    const results = await runNiktoScan(target);
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
