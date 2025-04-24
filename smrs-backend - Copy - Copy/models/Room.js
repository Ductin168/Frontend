const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    campus: { type: String, required: true },
    buildingRoom: { type: String, required: true, unique: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, required: true, enum: ['Trống', 'Đầy', 'Bảo trì'] }
  }, {
  collection: 'rooms' // Đảm bảo dùng collection 'rooms'
});

module.exports = mongoose.model('Room', roomSchema);