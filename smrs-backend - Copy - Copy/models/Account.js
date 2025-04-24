const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AccountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Name :{ type: String, required: true, unique: true },
  MSSV: { type: String, required: true, unique: true },
  SDT:{ type: String, required: true, unique: true },
  Class: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  email: { type: String, required: true, unique: true }, // Thêm trường email
}, {
  collection: 'accounts'
});

// Mã hóa mật khẩu trước khi lưu
AccountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      console.log('Đã mã hóa mật khẩu cho username:', this.username);
    } catch (error) {
      console.error('Lỗi khi mã hóa mật khẩu:', error.message);
      return next(error);
    }
  }
  next();
});

// So sánh mật khẩu
AccountSchema.methods.verify_pass = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log('Kết quả so sánh mật khẩu:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Lỗi khi so sánh mật khẩu:', error.message);
    return false;
  }
};

module.exports = mongoose.model('Account', AccountSchema);