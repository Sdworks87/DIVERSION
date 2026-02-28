require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { connectDb } = require('../src/config/database');
const Material = require('../src/models/Material');
const ImpactStat = require('../src/models/ImpactStat');

const materialsPath = path.join(__dirname, '../../firebase/seed-materials.json');
const impactPath = path.join(__dirname, '../../firebase/seed-impact-stats.json');

async function seed() {
  await connectDb();

  const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
  const impactStats = JSON.parse(fs.readFileSync(impactPath, 'utf8'));

  await Material.deleteMany({});
  await ImpactStat.deleteMany({});

  await Material.insertMany(
    materials.map((m) => ({
      name: m.name,
      pricePerKg: m.pricePerKg,
      change: m.change || '+₹0',
      changeUp: m.changeUp !== false,
      category: m.category || 'other',
    }))
  );

  await ImpactStat.insertMany(
    impactStats.map((s) => ({ key: s.key, value: s.value }))
  );

  console.log(`Seeded ${materials.length} materials and ${impactStats.length} impact stats.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
