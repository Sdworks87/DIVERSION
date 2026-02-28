const express = require('express');
const ImpactStat = require('../models/ImpactStat');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const docs = await ImpactStat.find().lean();
    const stats = {};
    docs.forEach((d) => {
      stats[d.key] = d.value;
    });
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
