const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config(); // Đọc biến môi trường từ .env

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const rooms = [];

  for (let i = 13; i <= 15; i++) {
    rooms.push(new Room({
      campus: 2,
      buildingRoom: `A${i}01`,
      startTime: '10:00',
      endTime: '12:00',
      status: 'Bảo Trì',
    }));
  }

  await Room.insertMany(rooms);
  console.log('Đã tạo 10 phòng thành công!');
  mongoose.connection.close();
}).catch(err => console.error(err));
