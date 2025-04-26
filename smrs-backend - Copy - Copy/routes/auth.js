const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Session = require('../models/Session');
const PasswordResetToken = require('../models/PasswordResetToken');

// Route lấy thông tin người dùng
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Bắt đầu lấy thông tin người dùng với token:', token || 'Không có token');

  if (!token) {
    console.warn('Không tìm thấy token trong header Authorization');
    return res.status(401).json({ message: 'Không tìm thấy token' });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Token hợp lệ:', decoded);

    // Tìm tài khoản
    const account = await Account.findOne({ username: decoded.username });
    if (!account) {
      console.warn('Không tìm thấy tài khoản với username:', decoded.username);
      return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    }

    // Kiểm tra session còn tồn tại không
    const session = await Session.findOne({ sessionID: token });
    if (!session) {
      console.warn('Không tìm thấy session tương ứng.');
      return res.status(401).json({ message: 'Phiên không còn tồn tại' });
    }

    // Trả dữ liệu người dùng
    console.log('Lấy thông tin người dùng thành công:', {
      username: account.username,
      Name: account.Name,
      MSSV: account.MSSV,
      SDT: account.SDT,
      Class: account.Class,
      role: account.role,
      email: account.email,
    });

    res.json({
      username: account.username,
      Name: account.Name,
      MSSV: account.MSSV,
      SDT: account.SDT,
      Class: account.Class,
      role: account.role,
      email: account.email,
      sessionValid: true,
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error.message);
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
});

// Route đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Bắt đầu đăng nhập với username:', username);

  if (!username || !password) {
    console.warn('Thiếu username hoặc password trong body');
    return res.status(400).json({ message: 'Vui lòng cung cấp username và password' });
  }

  try {
    const account = await Account.findOne({ username });
    if (!account) {
      console.log('Không tìm thấy tài khoản với username:', username);
      return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });
    }

    const isValidPassword = await account.verify_pass(password);
    if (!isValidPassword) {
      console.log('Mật khẩu không đúng cho username:', username);
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { 
        _id: account._id,
        username: account.username,
        Name: account.Name,
        MSSV: account.MSSV,
        SDT: account.SDT,
        Class: account.Class,
        role: account.role,
        email: account.email
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    console.log('Tạo token thành công:', token);

    if (!account._id) {
      console.error('Account._id không tồn tại:', account);
      return res.status(500).json({ message: 'Lỗi server: tài khoản không hợp lệ' });
    }

    const session = new Session({
      sessionID: token,
      account: account._id,
      createAt: new Date(),
      expiredAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    try {
      await session.save();
      console.log('Đã tạo session mới với sessionID:', token, 'cho account:', account._id);
    } catch (sessionError) {
      console.error('Lỗi khi lưu session:', sessionError.message);
      return res.status(500).json({ message: 'Lỗi server: không thể tạo session' });
    }

    res.json({ 
      token, 
      role: account.role,
      Name: account.Name,
      MSSV: account.MSSV,
      SDT: account.SDT,
      Class: account.Class,
      email: account.email
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route đăng xuất
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Bắt đầu đăng xuất với token:', token || 'Không có token');

  if (!token) {
    console.warn('Không tìm thấy token trong header Authorization');
    return res.status(401).json({ message: 'Không tìm thấy token' });
  }

  try {
    const session = await Session.findOneAndDelete({ sessionID: token });
    if (!session) {
      console.warn('Không tìm thấy session với sessionID:', token);
      return res.status(404).json({ message: 'Phiên không tồn tại' });
    }

    console.log('Đã xóa session với sessionID:', token);
    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Lỗi đăng xuất:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route quên mật khẩu
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  console.log('Bắt đầu yêu cầu quên mật khẩu với username:', username);

  if (!username) {
    console.warn('Thiếu username trong body');
    return res.status(400).json({ message: 'Vui lòng cung cấp username' });
  }

  try {
    const account = await Account.findOne({ username });
    if (!account) {
      console.log('Không tìm thấy tài khoản với username:', username);
      return res.status(404).json({ message: 'Tên đăng nhập không tồn tại' });
    }

    const resetToken = jwt.sign(
      { username: account.username, accountId: account._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    console.log('Tạo reset token thành công:', resetToken);

    const passwordReset = new PasswordResetToken({
      token: resetToken,
      account: account._id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    try {
      await passwordReset.save();
      console.log('Đã lưu reset token cho account:', account._id);
    } catch (error) {
      console.error('Lỗi khi lưu reset token:', error.message);
      return res.status(500).json({ message: 'Lỗi server: không thể lưu token' });
    }

    const frontendPort = process.env.FRONTEND_PORT || '3000';
    const resetUrl = `http://localhost:${frontendPort}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: account.email,
      subject: 'Đặt lại mật khẩu SMRS',
      html: `
        <p>Xin chào ${account.username},</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản SMRS. Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>SMRS Team</p>
      `,
    };

    try {
      await req.app.locals.transporter.sendMail(mailOptions);
      console.log('Đã gửi email đặt lại mật khẩu đến:', account.email);
      res.json({ message: 'Email đặt lại mật khẩu đã được gửi' });
    } catch (error) {
      console.error('Lỗi khi gửi email:', error.message);
      return res.status(500).json({ message: 'Lỗi server: không thể gửi email' });
    }
  } catch (error) {
    console.error('Lỗi quên mật khẩu:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route đặt lại mật khẩu
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  console.log('Bắt đầu đặt lại mật khẩu với token:', token);

  if (!token || !newPassword) {
    console.warn('Thiếu token hoặc newPassword trong body');
    return res.status(400).json({ message: 'Vui lòng cung cấp token và mật khẩu mới' });
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      console.log('Token hợp lệ:', decoded);
    } catch (error) {
      console.warn('Token không hợp lệ hoặc đã hết hạn:', error.message);
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    const passwordReset = await PasswordResetToken.findOne({ token });
    if (!passwordReset) {
      console.warn('Không tìm thấy reset token:', token);
      return res.status(404).json({ message: 'Token không tồn tại' });
    }

    if (passwordReset.expiresAt < new Date()) {
      console.warn('Reset token đã hết hạn:', token);
      await PasswordResetToken.deleteOne({ token });
      return res.status(400).json({ message: 'Token đã hết hạn' });
    }

    const account = await Account.findById(passwordReset.account);
    if (!account) {
      console.warn('Không tìm thấy tài khoản cho reset token:', token);
      return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    }

    account.password = newPassword;
    await account.save();
    console.log('Đã cập nhật mật khẩu cho account:', account._id);

    await PasswordResetToken.deleteOne({ token });
    console.log('Đã xóa reset token:', token);

    res.json({ message: 'Mật khẩu đã được đặt lại thành công' });
  } catch (error) {
    console.error('Lỗi đặt lại mật khẩu:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;