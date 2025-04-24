const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Kiểm tra kết nối nodemailer
transporter.verify((error, success) => {
  if (error) {
    console.error('Lỗi cấu hình nodemailer:', error.message);
  } else {
    console.log('Nodemailer sẵn sàng gửi email');
  }
});

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Lưu transporter để dùng trong routes
app.locals.transporter = transporter;

// Gắn các routes
app.use('/api', authRoutes);
app.use('/api', roomRoutes);
app.use('/api/bookings', bookingRoutes)

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} đang được sử dụng, thử port ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error('Lỗi server:', err);
    process.exit(1);
  }
});