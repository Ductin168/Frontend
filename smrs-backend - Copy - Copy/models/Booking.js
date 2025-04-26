const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  campus: { type: String, required: true },
  classId: { type: String, required: true },
  timeSlot: { type: String, required: true },
  fullname: { type: String, required: true },
  mssv: { type: String, required: true },
  email: { type: String, required: true },
  phonenumber: { type: String, required: true },
  className: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  status: { type: String, required: true, enum: ['booked', 'transferred', 'cancelled'] },
  isDeleted:{ type: Boolean, default : false} ,
  deletedAt:{ type: Date ,default: null }
}, {
  collection: 'userbookinginformations'
});

module.exports = mongoose.model('UserBookingInformation', bookingSchema);