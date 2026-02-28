const mongoose = require('mongoose');

const eprSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recyclerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pickup', required: true },
    materials: { type: [Object], default: [] },
    weightKg: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eprSchema.index({ userId: 1, createdAt: -1 });
eprSchema.index({ recyclerId: 1, createdAt: -1 });

module.exports = mongoose.model('EprCertificate', eprSchema);
