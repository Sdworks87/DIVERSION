const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scrapchain';

let connected = false;

async function connectDb() {
  if (connected) return mongoose.connection;
  try {
    await mongoose.connect(MONGODB_URI);
    connected = true;
    console.log('[MongoDB] Connected');
    return mongoose.connection;
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
    throw err;
  }
}

module.exports = { connectDb };
