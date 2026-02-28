const express = require('express');
const Material = require('../models/Material');
const { authRequired } = require('../middleware/auth');
const { toApi } = require('../utils/toApi');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const materials = await Material.find().sort({ name: 1 }).lean();
    res.json(toApi(materials));
  } catch (err) {
    next(err);
  }
});

router.post('/estimate', authRequired(['citizen']), async (req, res, next) => {
  try {
    const { materials: selections } = req.body;
    if (!Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ error: 'materials array is required with materialId and weightKg' });
    }

    const materialsMap = {};
    const docs = await Material.find().lean();
    docs.forEach((d) => {
      materialsMap[d._id.toString()] = d;
    });

    let total = 0;
    const breakdown = [];
    for (const s of selections) {
      const m = materialsMap[s.materialId];
      if (!m || typeof s.weightKg !== 'number') continue;
      const amount = (m.pricePerKg || 0) * s.weightKg;
      total += amount;
      breakdown.push({ materialId: s.materialId, name: m.name, weightKg: s.weightKg, amount });
    }

    res.json({ estimate: total, breakdown });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authRequired(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pricePerKg, change, changeUp, category } = req.body;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    if (typeof pricePerKg === 'number') material.pricePerKg = pricePerKg;
    if (typeof change === 'string') material.change = change;
    if (typeof changeUp === 'boolean') material.changeUp = changeUp;
    if (typeof category === 'string') material.category = category;

    await material.save();
    res.json(toApi(material));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
