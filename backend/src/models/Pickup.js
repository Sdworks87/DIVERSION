const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kabadiId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'collected', 'completed'],
      default: 'pending',
    },
    photoUrl: { type: String, default: null },
    materials: { type: [Object], default: [] },
    weightKg: { type: Number, default: null },
    amount: { type: Number, default: null },
    address: { type: String, required: true },
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

pickupSchema.index({ userId: 1, createdAt: -1 });
pickupSchema.index({ kabadiId: 1, createdAt: -1 });
pickupSchema.index({ status: 1 });
pickupSchema.index({ status: 1, kabadiId: 1 });

module.exports = mongoose.model('Pickup', pickupSchema);
