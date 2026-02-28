const express = require('express');
const Pickup = require('../models/Pickup');
const { authRequired } = require('../middleware/auth');
const { toApi } = require('../utils/toApi');

const router = express.Router();
const STATUSES = ['pending', 'scheduled', 'collected', 'completed'];

router.post('/', authRequired(['citizen']), async (req, res, next) => {
  try {
    const { address, scheduledAt, materials = [], photoUrl } = req.body;
    const userId = req.user.id;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const pickup = await Pickup.create({
      userId,
      kabadiId: null,
      status: 'pending',
      photoUrl: photoUrl || null,
      materials: Array.isArray(materials) ? materials : [],
      weightKg: null,
      amount: null,
      address,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    });

    res.status(201).json(toApi(pickup));
  } catch (err) {
    next(err);
  }
});

router.get('/available', authRequired(['kabadi']), async (req, res, next) => {
  try {
    const pickups = await Pickup.find({ status: 'pending', kabadiId: null })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(pickups);
  } catch (err) {
    next(err);
  }
});

router.get('/', authRequired(), async (req, res, next) => {
  try {
    const { role, id } = req.user;

    let filter = {};
    if (role === 'citizen') {
      filter = { userId: id };
    } else if (role === 'kabadi') {
      filter = { kabadiId: id };
    } else if (role === 'recycler' || role === 'admin') {
      filter = { status: 'completed' };
    } else {
      filter = { _id: null };
    }

    const pickups = await Pickup.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json(toApi(pickups));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authRequired(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, kabadiId, weightKg, amount } = req.body;
    const { role, id: userId } = req.user;

    const pickup = await Pickup.findById(id);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    if (role === 'citizen' && pickup.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (role === 'kabadi' && pickup.kabadiId && pickup.kabadiId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (status && STATUSES.includes(status)) pickup.status = status;
    if (role === 'admin' && kabadiId) pickup.kabadiId = kabadiId;
    if (role === 'kabadi' && kabadiId === userId) pickup.kabadiId = kabadiId;
    if (typeof weightKg === 'number') pickup.weightKg = weightKg;
    if (typeof amount === 'number') pickup.amount = amount;

    await pickup.save();
    res.json(toApi(pickup));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
