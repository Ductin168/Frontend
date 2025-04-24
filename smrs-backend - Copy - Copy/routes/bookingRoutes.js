// bookingRoutes.js (Đã fix: bỏ session nếu chỉ dùng JWT, đơn giản hóa middleware)

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware kiểm tra token (chỉ dùng JWT)
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không tìm thấy token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// API tạo đặt chỗ + cập nhật trạng thái phòng (gộp vào 1 transaction)
router.post('/', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingData = {
      account: req.user._id,
      campus: req.body.campus,
      buildingRoom: req.body.buildingRoom,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      fullname: req.body.fullname,
      mssv: req.body.mssv,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      className: req.body.class,
    };

    const newBooking = new Booking(bookingData);
    await newBooking.save({ session });

    const room = await Room.findOne({
      buildingRoom: req.body.buildingRoom,
      campus: req.body.campus,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    }).session(session);

    if (!room) {
      throw new Error('Không tìm thấy phòng để cập nhật trạng thái');
    }

    room.status = 'Đầy';
    await room.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Đặt chỗ thành công', booking: newBooking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Lỗi khi tạo đặt chỗ:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo đặt chỗ' });
  }
});

// API lấy danh sách đặt chỗ của người dùng
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ account: req.user._id })
      .populate('account', 'username Name MSSV email');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đặt chỗ' });
  }
});

// API xóa đặt chỗ
router.delete('/:id', authenticateToken, async (req, res) => {
  const bookingId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Không tìm thấy thông tin đặt chỗ' });
    }

    if (booking.account.toString() !== req.user._id && req.user.role !== 'admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Bạn không có quyền xóa đặt chỗ này' });
    }

    console.log('🧾 Booking bị xóa:', {
      buildingRoom: booking.buildingRoom,
      campus: booking.campus,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    // Xoá đặt chỗ
    await Booking.findByIdAndDelete(bookingId).session(session);

    // Format giờ chuẩn HH:mm
    const formatTime = (timeStr) => {
      const [h, m] = timeStr.split(':');
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const formattedStart = formatTime(booking.startTime);
    const formattedEnd = formatTime(booking.endTime);

    console.log('🔍 Tìm Room với:', {
      buildingRoom: booking.buildingRoom,
      campus: booking.campus,
      startTime: formattedStart,
      endTime: formattedEnd,
    });

    const updatedRoom = await Room.findOneAndUpdate(
      {
        buildingRoom: booking.buildingRoom,
        campus: booking.campus,
        startTime: formattedStart,
        endTime: formattedEnd,
      },
      { status: 'Trống' },
      { session, new: true }
    );

    if (updatedRoom) {
      console.log(`✅ Đã cập nhật trạng thái phòng ${updatedRoom.buildingRoom} thành Trống`);
    } else {
      console.warn(`⚠️ Không tìm thấy phòng để cập nhật trạng thái`);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Xóa đặt chỗ thành công' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Lỗi khi xóa đặt chỗ:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa đặt chỗ' });
  }
});


module.exports = router;