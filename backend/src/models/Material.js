const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pricePerKg: { type: Number, required: true, default: 0 },
    change: { type: String, default: '+₹0' },
    changeUp: { type: Boolean, default: true },
    category: { type: String, default: 'other' },
  },
  { timestamps: true }
);

materialSchema.index({ name: 1 });

module.exports = mongoose.model('Material', materialSchema);
