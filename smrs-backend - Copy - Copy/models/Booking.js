const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  campus: { type: String, required: true },
  buildingRoom: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  fullname: { type: String, required: true },
  mssv: { type: String, required: true },
  email: { type: String, required: true },
  phonenumber: { type: String, required: true },
  className: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
}, {
  collection: 'userbookinginformations'
});

module.exports = mongoose.model('UserBookingInformation', bookingSchema);