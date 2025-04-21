const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionID: { type: String, required: true, unique: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  createAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, required: true }
}, {
  collection: 'sessions' // Đảm bảo collection tên là 'sessions'
});

module.exports = mongoose.model('Session', sessionSchema);