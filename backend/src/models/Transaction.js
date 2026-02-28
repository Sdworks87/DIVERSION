const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    pickupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pickup', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentRef: { type: String, default: null },
    status: { type: String, default: 'completed' },
  },
  { timestamps: true }
);

transactionSchema.index({ pickupId: 1 });
transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
