// backend/src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['viewer'] }, // admin, analyst, viewer
  isTotpEnabled: { type: Boolean, default: false },
  totpSecret: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
