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
      classId: req.body.classId,
      timeSlot: req.body.timeSlot,
      fullname: req.body.fullname,
      mssv: req.body.mssv,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      className: req.body.className,
      status: req.body.status || 'booked',
    };

    const newBooking = new Booking(bookingData);
    await newBooking.save({ session });

    const room = await Room.findOne({
      classId: req.body.classId,
      campus: req.body.campus,
      timeSlot: req.body.timeSlot,
    }).session(session);

    if (!room) {
      throw new Error('Không tìm thấy phòng để cập nhật trạng thái');
    }

    room.status = 'Reserved';
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
      classId: booking.classId,
      campus: booking.campus,
      timeSlot: booking.timeSlot,
    });

    // Xóa đặt chỗ
    await Booking.findByIdAndDelete(bookingId).session(session);

    const updatedRoom = await Room.findOneAndUpdate(
      {
        classId: booking.classId,
        campus: booking.campus,
        timeSlot: booking.timeSlot,
      },
      { status: 'Available' },
      { session, new: true }
    );

    if (updatedRoom) {
      console.log(`✅ Đã cập nhật trạng thái phòng ${updatedRoom.classId} thành Available`);
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