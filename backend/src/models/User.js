const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['citizen', 'kabadi', 'recycler', 'admin'] },
    phone: { type: String, unique: true, sparse: true },
    address: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
