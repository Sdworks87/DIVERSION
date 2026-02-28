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

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'Role must be one of: citizen, kabadi, recycler, admin' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      name,
      role,
      phone: phone || null,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
