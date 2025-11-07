const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  roles: { type: [String], default: ['viewer'] },
  totpSecret: { type: String, default: null },
  totpEnabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
