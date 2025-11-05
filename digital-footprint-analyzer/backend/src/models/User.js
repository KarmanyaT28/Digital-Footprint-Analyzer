const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: { type: String },
  roles: { type: [String], default: ['analyst'] },
  totpSecret: { type: String, default: null }, // base32 secret for TOTP
  isTotpEnabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
