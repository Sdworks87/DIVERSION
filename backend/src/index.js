require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const { connectDb } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendDir = path.join(__dirname, '../../frontend');

const authRoutes = require('./routes/auth');
const materialsRoutes = require('./routes/materials');
const pickupsRoutes = require('./routes/pickups');
const transactionsRoutes = require('./routes/transactions');
const eprRoutes = require('./routes/epr');
const uploadRoutes = require('./routes/upload');
const impactRoutes = require('./routes/impact');

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/pickups', pickupsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/epr', eprRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/impact', impactRoutes);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(frontendDir));
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Generic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // In production you might log this to an external service
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ScrapChain backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
