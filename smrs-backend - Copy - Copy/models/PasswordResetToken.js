const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
}, {
  collection: 'password_reset_tokens'
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);