const mongoose = require('mongoose');
const Account = require('./models/Account');
require('dotenv').config(); // Thêm dòng này để đọc biến môi trường từ .env

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smrs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const newAccount = new Account({
    username: 'tintin123',
    password: '12345',
    role: 'student',
    email: 'DinhBaoNam77@gmail.com', 
  });
  await newAccount.save();
  console.log('Đã tạo tài khoản tintin');
  mongoose.connection.close();
}).catch(err => console.error(err));