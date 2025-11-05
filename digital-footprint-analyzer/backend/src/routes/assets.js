const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const { broadcastAssetUpdate } = require('../../index');

// Create/upsert asset
router.post('/', async (req, res) => {
  const { orgId, type, identifier, metadata, relationships } = req.body;
  let asset = await Asset.findOne({ orgId, identifier });
  if (!asset) {
    asset = new Asset({ orgId, type, identifier, metadata, relationships });
  } else {
    asset.metadata = { ...asset.metadata, ...metadata };
    asset.lastSeenAt = new Date();
    // merge/append relationships — keep simple
    asset.relationships = relationships || asset.relationships;
  }
  await asset.save();
  // broadcast to realtime clients
  broadcastAssetUpdate(orgId, { action: 'upsert', asset });
  res.json({ ok: true, asset });
});

// Query assets (simple)
router.get('/', async (req, res) => {
  const { orgId, type, q } = req.query;
  const filter = { orgId };
  if (type) filter.type = type;
  if (q) filter.identifier = { $regex: q, $options: 'i' };
  const assets = await Asset.find(filter).limit(200);
  res.json({ assets });
});

module.exports = router;
