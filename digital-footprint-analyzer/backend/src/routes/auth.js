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
router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    console.log('Register route hit', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ error: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Generate TOTP secret for Google Authenticator
      const secret = speakeasy.generateSecret({ name: `DFV (${email})` });

      const user = new User({
        email,
        passwordHash,
        roles: ['viewer'],
        totpSecret: secret.base32 // store base32 secret in DB
      });
      await user.save();

      // Generate QR code for user to scan
      const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

      return res.json({
        message: 'Registered successfully',
        user: { id: user._id, email: user.email },
        qrCode: qrCodeUrl
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

// -----------------------------
// LOGIN ROUTE
// -----------------------------
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists(),
    body('totp').optional() // TOTP code is optional initially
  ],
  async (req, res) => {
    console.log('Login route hit', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, totp } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      // If TOTP secret exists and totp code not provided, ask for TOTP
      if (user.totpSecret && !totp) {
        return res.status(206).json({ message: 'TOTP required' });
      }

      // Verify TOTP if provided
      if (user.totpSecret && totp) {
        const verified = speakeasy.totp.verify({
          secret: user.totpSecret,
          encoding: 'base32',
          token: totp,
          window: 1 // allow 30s drift
        });
        if (!verified) return res.status(401).json({ error: 'Invalid TOTP code' });
      }

      // Generate JWT
      const payload = { sub: user._id, roles: user.roles, email: user.email };
      const access = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });

      return res.json({ access, user: { id: user._id, email: user.email, roles: user.roles } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
