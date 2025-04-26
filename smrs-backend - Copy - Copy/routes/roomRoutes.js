const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const jwt = require('jsonwebtoken');

// Middleware xác thực
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('Không tìm thấy token trong header Authorization');
    return res.status(401).json({ message: 'Không tìm thấy token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error.message);
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// GET all rooms
router.get('/rooms', authenticate, async (req, res) => {
  try {
    console.log('Gửi yêu cầu lấy danh sách phòng');
    const rooms = await Room.find();
    console.log('Danh sách phòng:', rooms);
    res.json(rooms);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng', error });
  }
});

// POST create new room
router.post('/rooms', authenticate, async (req, res) => {
  try {
    console.log('Gửi yêu cầu thêm phòng mới:', req.body);
    const room = req.body;
    const result = await Room.create(room);
    console.log('Phòng mới được tạo:', result);
    res.json(result);
  } catch (error) {
    console.error('Lỗi khi thêm phòng mới:', error.message);
    res.status(500).json({ message: 'Lỗi khi thêm phòng mới', error });
  }
});

// PUT update room by classId
router.put('/rooms/:classId', authenticate, async (req, res) => {
  try {
    const classId = req.params.classId;
    const { status } = req.body;
    console.log('Gửi yêu cầu cập nhật phòng:', { classId, status });

    const room = await Room.findOne({ classId });
    if (!room) {
      console.error('Phòng không tồn tại:', classId);
      return res.status(404).json({ message: 'Phòng không tồn tại' });
    }

    if (room.status !== 'Available' && status === 'Reserved') {
      console.warn('Phòng không ở trạng thái Available:', room);
      return res.status(400).json({ message: 'Chỉ có thể đặt phòng ở trạng thái Available' });
    }

    const result = await Room.findOneAndUpdate(
      { classId },
      { status },
      { new: true }
    );
    console.log('Phòng được cập nhật:', result);
    res.json(result);
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng:', error.message);
    res.status(500).json({ message: 'Lỗi khi cập nhật phòng', error });
  }
});

// DELETE room by id
router.delete('/rooms/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Gửi yêu cầu xóa phòng:', id);
    const result = await Room.findByIdAndDelete(id);
    if (!result) {
      console.error('Phòng không tồn tại:', id);
      return res.status(404).json({ message: 'Phòng không tồn tại' });
    }
    console.log('Phòng đã xóa:', result);
    res.json({ message: 'Xóa thành công', data: result });
  } catch (error) {
    console.error('Lỗi khi xóa phòng:', error.message);
    res.status(500).json({ message: 'Lỗi khi xóa phòng', error });
  }
});

module.exports = router;