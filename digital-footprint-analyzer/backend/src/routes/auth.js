const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({ email, passwordHash: hash });
  await user.save();
  res.json({ ok: true });
});

router.post('/login', async (req, res) => {
  const { email, password, totp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ error: 'Invalid' });

  if (user.isTotpEnabled) {
    if (!totp) return res.status(403).json({ error: 'TOTP required' });
    const ok = speakeasy.totp.verify({ secret: user.totpSecret, encoding: 'base32', token: totp });
    if (!ok) return res.status(403).json({ error: 'Invalid TOTP' });
  }

  const access = jwt.sign({ sub: user._id, roles: user.roles }, JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ sub: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  res.json({ access, refresh });
});

// Create TOTP secret & QR for client (protected)
router.post('/totp/setup', async (req, res) => {
  // assume user is authenticated and req.userId present (middleware)
  const userId = req.body.userId; // replace with real auth
  const secret = speakeasy.generateSecret({ name: `DFV (${req.body.email || 'org'})` });
  const otpauth = secret.otpauth_url;
  const imgData = await qrcode.toDataURL(otpauth);
  // Save base32 to user.totpSecret only AFTER user verifies code (below)
  res.json({ secretBase32: secret.base32, qr: imgData });
});

router.post('/totp/verify', async (req, res) => {
  const { userId, token, secretBase32 } = req.body;
  const ok = speakeasy.totp.verify({ secret: secretBase32, encoding: 'base32', token });
  if (!ok) return res.status(403).json({ error: 'Invalid token' });
  const user = await User.findById(userId);
  user.totpSecret = secretBase32;
  user.isTotpEnabled = true;
  await user.save();
  res.json({ ok: true });
});

module.exports = router;
