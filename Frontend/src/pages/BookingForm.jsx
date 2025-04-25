import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const BookingForm = () => {
  const { userData, isLoading } = useContext(UserContext);
  const totalTime = 10 * 60; // 10 phút giữ chỗ
  const [timeLeft, setTimeLeft] = useState(() => {
    const startTime = sessionStorage.getItem('startTime');
    if (!startTime) {
      const now = Date.now();
      sessionStorage.setItem('startTime', now);
      return totalTime;
    }
    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    return Math.max(totalTime - elapsed, 0);
  });

  const [formData, setFormData] = useState({
    fullName: userData?.Name || '',
    studentId: userData?.MSSV || '',
    email: userData?.email || '',
    phone: userData?.SDT || '',
    class: userData?.Class || '',
  });
  const [errors, setErrors] = useState({});
  const selectedRoom = JSON.parse(sessionStorage.getItem('selectedRoom')) || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !userData) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          sessionStorage.removeItem('startTime');
          setTimeout(() => {
            alert('⏰ Thời gian giữ chỗ đã hết. Chuyển về dashboard.');
            navigate('/dashboard');
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, isLoading, userData]);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.Name || '',
        studentId: userData.MSSV || '',
        email: userData.email || '',
        phone: userData.SDT || '',
        class: userData.Class || '',
      });
    }
  }, [userData]);

  useEffect(() => {
    if (!selectedRoom.classId || !selectedRoom.timeSlot || selectedRoom.status !== 'cancelled') {
      alert('❌ Không tìm thấy thông tin phòng hoặc phòng không trống. Vui lòng chọn lại phòng.');
      navigate('/dat-cho-hoc');
    }
  }, [navigate, selectedRoom]);

  const formatTime = () => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim()) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('⚠️ Vui lòng điền đầy đủ tất cả các thông tin bắt buộc!');
      return;
    }

    if (!selectedRoom.classId || !selectedRoom.campus || !selectedRoom.timeSlot) {
      alert('❌ Thiếu thông tin phòng. Vui lòng chọn lại phòng.');
      navigate('/dat-cho-hoc');
      return;
    }

    const confirmed = window.confirm('Bạn có chắc chắn muốn xác nhận đặt chỗ này không?');
    if (!confirmed) {
      alert('❌ Đã hủy đặt chỗ.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('❌ Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      navigate('/');
      return;
    }

    try {
      const bookingData = {
        fullname: formData.fullName,
        mssv: formData.studentId,
        email: formData.email,
        phonenumber: formData.phone,
        class: formData.class,
        campus: selectedRoom.campus,
        classId: selectedRoom.classId,
        timeSlot: selectedRoom.timeSlot,
      };

      const response = await fetch(`http://localhost:5001/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        console.error('Lỗi phân tích phản hồi:', rawText);
        alert('❌ Phản hồi từ server không hợp lệ. Vui lòng thử lại.');
        return;
      }

      if (response.ok) {
        alert('✅ Đặt chỗ thành công! Thông tin của bạn đã được ghi nhận.');
        sessionStorage.removeItem('startTime');
        sessionStorage.removeItem('selectedRoom');
        navigate('/dashboard');
      } else {
        alert(`❌ Lỗi khi lưu thông tin đặt chỗ: ${data.message || 'Không xác định'}`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert(`❌ Lỗi kết nối server: ${error.message || 'Vui lòng thử lại.'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-[3000]">
        <div className="spinner border-4 border-t-primary rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-purple-900 text-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8">Thông Tin Sinh Viên và Chỗ Ngồi</h2>
        <div className="flex flex-col md:flex-row gap-12 p-10">
          <div className="flex flex-col gap-4">
            <label className="text-lg">Họ và Tên</label>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và Tên"
              className={`p-2 rounded bg-gray-800 border-2 ${errors.fullName ? 'border-red-500' : formData.fullName ? 'border-green-500' : 'border-transparent'}`}
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <label className="text-lg">MSSV</label>
            <input
              type="text"
              name="studentId"
              placeholder="MSSV"
              className={`p-2 rounded bg-gray-800 border-2 ${errors.studentId ? 'border-red-500' : formData.studentId ? 'border-green-500' : 'border-transparent'}`}
              value={formData.studentId}
              onChange={handleInputChange}
            />
            <label className="text-lg">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`p-2 rounded bg-gray-800 border-2 ${errors.email ? 'border-red-500' : formData.email ? 'border-green-500' : 'border-transparent'}`}
              value={formData.email}
              onChange={handleInputChange}
            />
            <label className="text-lg">Số Điện Thoại</label>
            <input
              type="text"
              name="phone"
              placeholder="Số Điện Thoại"
              className={`p-2 rounded bg-gray-800 border-2 ${errors.phone ? 'border-red-500' : formData.phone ? 'border-green-500' : 'border-transparent'}`}
              value={formData.phone}
              onChange={handleInputChange}
            />
            <label className="text-lg">Lớp</label>
            <input
              type="text"
              name="class"
              placeholder="Lớp"
              className={`p-2 rounded bg-gray-800 border-2 ${errors.class ? 'border-red-500' : formData.class ? 'border-green-500' : 'border-transparent'}`}
              value={formData.class}
              onChange={handleInputChange}
            />
          </div>
          <div className="bg-blue-6
00 p-5 rounded-xl text-yellow-300 min-w-[250px]">
            <h3 className="text-white text-lg mb-2">
              Thời Gian Giữ Chỗ <span className="float-right text-red-500 font-bold">{formatTime()}</span>
            </h3>
            <label className="text-lg">Cơ sở</label>
            <input
              type="text"
              value={`Cơ sở ${selectedRoom.campus || '2'}`}
              readOnly
              className="p-2 rounded bg-gray-800 w-full"
            />
            <label className="text-lg">Phòng</label>
            <input
              type="text"
              value={selectedRoom.classId || 'H6-812'}
              readOnly
              className="p-2 rounded bg-gray-800 w-full"
            />
            <label className="text-lg">Thời Gian</label>
            <input
              type="text"
              value={selectedRoom.timeSlot || '7:00-8:50'}
              readOnly
              className="p-2 rounded bg-gray-800 w-full"
            />
          </div>
        </div>
        <button
          className="mt-8 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transform hover:-translate-y-1 hover:shadow-lg"
          onClick={handleSubmit}
        >
          Xác Nhận Đặt Chỗ
        </button>
      </div>
    </div>
  );
};

export default BookingForm;