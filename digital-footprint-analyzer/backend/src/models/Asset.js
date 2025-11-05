const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  orgId: { type: String, index: true },
  type: { type: String, enum: ['domain','subdomain','ip','cert','api','service'] },
  identifier: { type: String }, // e.g. "mail.example.com" or "1.2.3.4"
  metadata: { type: Object, default: {} },
  relationships: [{
    type: { type: String }, // e.g. "resolves_to", "issued_by"
    targetAssetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }
  }],
  riskScore: { type: Number, default: 0 },
  discoveredAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
