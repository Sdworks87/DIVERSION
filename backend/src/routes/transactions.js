const express = require('express');
const Pickup = require('../models/Pickup');
const Transaction = require('../models/Transaction');
const { authRequired } = require('../middleware/auth');
const { toApi } = require('../utils/toApi');

const router = express.Router();

router.post('/', authRequired(['citizen', 'kabadi', 'admin']), async (req, res, next) => {
  try {
    const { pickupId, amount, paymentRef } = req.body;
    const userId = req.user.id;

    if (!pickupId || typeof amount !== 'number') {
      return res.status(400).json({ error: 'pickupId and amount are required' });
    }

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    if (pickup.status !== 'completed') {
      return res.status(400).json({ error: 'Pickup must be completed before creating transaction' });
    }

    const txn = await Transaction.create({
      pickupId,
      userId: pickup.userId,
      amount,
      paymentRef: paymentRef || null,
      status: 'completed',
    });

    res.status(201).json(toApi(txn));
  } catch (err) {
    next(err);
  }
});

router.get('/', authRequired(), async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const { pickupId } = req.query;

    let filter = {};
    if (pickupId) {
      filter = { pickupId };
    } else if (role === 'citizen') {
      filter = { userId: id };
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json(toApi(transactions));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
