const mongoose = require('mongoose');
const Account = require('./models/Account'); // Import model Account từ thư mục models
require('dotenv').config(); // Đọc biến môi trường từ .env

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    const newAccount = new Account({
      username: 'admin1',
      password: 'admin123',
      Name: 'Admin',
      MSSV: '2213489',
      SDT: '0702737500',
      Class: 'MT22KT03',
      role: 'student',
      email: 'hoductin16088@gmail.com',
    });

    await newAccount.save();
    console.log('Đã tạo tài khoản thành công cho username:', newAccount.username);
  } catch (err) {
    console.error('Lỗi khi tạo tài khoản:', err.message);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Lỗi kết nối MongoDB:', err.message);
  mongoose.connection.close();
});