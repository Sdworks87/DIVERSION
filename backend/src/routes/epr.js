const express = require('express');
const Pickup = require('../models/Pickup');
const EprCertificate = require('../models/EprCertificate');
const { authRequired } = require('../middleware/auth');
const { toApi } = require('../utils/toApi');

const router = express.Router();

router.post('/', authRequired(['recycler', 'admin']), async (req, res, next) => {
  try {
    const { pickupId } = req.body;
    const recyclerId = req.user.id;

    if (!pickupId) {
      return res.status(400).json({ error: 'pickupId is required' });
    }

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    if (pickup.status !== 'completed') {
      return res.status(400).json({ error: 'EPR can only be generated for completed pickups' });
    }

    const certificate = await EprCertificate.create({
      userId: pickup.userId,
      recyclerId,
      pickupId,
      materials: pickup.materials || [],
      weightKg: pickup.weightKg || 0,
    });

    res.status(201).json(toApi(certificate));
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
    } else if (role === 'recycler' || role === 'admin') {
      filter = { recyclerId: id };
    } else {
      filter = { _id: null };
    }

    const certs = await EprCertificate.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json(toApi(certs));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
