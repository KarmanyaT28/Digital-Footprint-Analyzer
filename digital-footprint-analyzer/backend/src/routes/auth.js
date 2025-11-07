const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const ACCESS_EXPIRES = '15m'; // change for prod

// -----------------------------
// REGISTER ROUTE
// -----------------------------
// const speakeasy = require('speakeasy');
// const qrcode = require('qrcode');

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ✅ Generate secret for Google Authenticator
    const secret = speakeasy.generateSecret({
      name: `DFV (${email})`
    });

    const user = await User.create({
      email,
      passwordHash,
      totpSecret: secret.base32,
      totpEnabled: true
    });

    // ✅ Convert to QR Code
    const qrImage = await qrcode.toDataURL(secret.otpauth_url);

    return res.json({ qrImage, message: "Scan QR with Google Authenticator" });
  }
);


// -----------------------------
// LOGIN ROUTE
// -----------------------------
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  body('totp').isLength({ min: 6, max: 6 }),
  async (req, res) => {
    const { email, password, totp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // ✅ TOTP verify
    const valid = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: totp
    });

    if (!valid) return res.status(401).json({ error: "Invalid Authenticator Code" });

    const payload = { sub: user._id, roles: user.roles, email: user.email };
    const access = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });

    return res.json({ access });
  }
);


module.exports = router;
