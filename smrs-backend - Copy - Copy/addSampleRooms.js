const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');

// Tải biến môi trường từ .env
dotenv.config();

// Kết nối đến MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Hàm thêm dữ liệu mẫu
const addSampleRooms = async () => {
  try {
    // Kiểm tra xem collection rooms đã có dữ liệu chưa
    const count = await Room.countDocuments();
    if (count > 0) {
      console.log('Collection rooms đã có dữ liệu, không thêm mới.');
      return;
    }

    // Tạo 10 bản ghi mẫu
    const sampleRooms = [
      {
        campus: 1,
        buildingRoom: 'Tòa A-Phòng 101',
        startTime: '06:00',
        endTime: '07:50',
        status: 'Trống',
      },
      {
        campus: 1,
        buildingRoom: 'Tòa A-Phòng 102',
        startTime: '08:00',
        endTime: '09:50',
        status: 'Đầy',
      },
      {
        campus: 1,
        buildingRoom: 'Tòa B-Phòng 201',
        startTime: '10:00',
        endTime: '11:50',
        status: 'Trống',
      },
      {
        campus: 1,
        buildingRoom: 'Tòa B-Phòng 202',
        startTime: '12:00',
        endTime: '13:50',
        status: 'Bảo trì',
      },
      {
        campus: 2,
        buildingRoom: 'Tòa C-Phòng 301',
        startTime: '14:00',
        endTime: '15:50',
        status: 'Trống',
      },
      {
        campus: 2,
        buildingRoom: 'Tòa C-Phòng 302',
        startTime: '16:00',
        endTime: '17:50',
        status: 'Đầy',
      },
      {
        campus: 2,
        buildingRoom: 'Tòa D-Phòng 401',
        startTime: '18:00',
        endTime: '19:50',
        status: 'Trống',
      },
      {
        campus: 2,
        buildingRoom: 'Tòa D-Phòng 402',
        startTime: '20:00',
        endTime: '21:50',
        status: 'Bảo trì',
      },
      {
        campus: 1,
        buildingRoom: 'Tòa E-Phòng 501',
        startTime: '06:00',
        endTime: '07:50',
        status: 'Trống',
      },
      {
        campus: 2,
        buildingRoom: 'Tòa E-Phòng 502',
        startTime: '08:00',
        endTime: '09:50',
        status: 'Đầy',
      },
    ];

    // Thêm dữ liệu vào collection rooms
    await Room.insertMany(sampleRooms);
    console.log('Đã thêm 10 phòng mẫu vào collection rooms!');
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu mẫu:', error.message);
  } finally {
    // Đóng kết nối
    mongoose.connection.close(() => {
      console.log('Đã đóng kết nối MongoDB');
      process.exit(0);
    });
  }
};

// Chạy hàm
addSampleRooms();