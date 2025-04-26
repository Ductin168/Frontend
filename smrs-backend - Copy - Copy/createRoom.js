const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config(); // Đọc biến môi trường từ .env

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const rooms = [];

  for (let i = 25; i <= 27; i++) {
    rooms.push(new Room({
      campus: 2,
      classId: `A${i}01`,
      timeSlot: '10:00-12:00',
      status: 'Reserved',
    }));
  }

  await Room.insertMany(rooms);
  console.log('Đã tạo 3 phòng thành công!');
  mongoose.connection.close();
}).catch(err => console.error(err));