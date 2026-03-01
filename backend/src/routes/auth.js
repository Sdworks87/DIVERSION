const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, authRequired } = require('../middleware/auth');
const { toApi } = require('../utils/toApi');

const router = express.Router();
const ROLES = ['citizen', 'kabadi', 'recycler', 'admin'];

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role = 'citizen', phone, address } = req.body;

    if (!password || !name) {
      return res.status(400).json({ error: 'Password and name are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ error: 'Either email or phone is required' });
    }

    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'Role must be one of: citizen, kabadi, recycler, admin' });
    }

    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) return res.status(400).json({ error: 'Email already registered' });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email ? email.toLowerCase() : undefined,
      passwordHash: hashedPassword,
      name,
      role,
      phone: phone || undefined,
      address: address || null,
    });

    const userSafe = toApi(user);
    delete userSafe.passwordHash;
    const token = generateToken({ id: user._id.toString(), role: user.role });

    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required' });
    }

    // Try finding by email first, if fails try by phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userSafe = toApi(user);
    delete userSafe.passwordHash;
    const token = generateToken({ id: user._id.toString(), role: user.role });

    res.json({ token, user: userSafe });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authRequired(), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userSafe = toApi(user);
    delete userSafe.passwordHash;
    res.json(userSafe);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
