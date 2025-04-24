import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function SeatListApp() {
  const context = useContext(UserContext);
  const { userData, isLoading } = context || {};
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]);
  const [search, setSearch] = useState('');
  const [campus, setCampus] = useState('');
  const [status, setStatus] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  // Hàm lấy danh sách phòng
  const fetchSeats = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('authToken không tồn tại');
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      navigate('/');
      return;
    }

    try {
      console.log('Gửi yêu cầu GET /api/rooms');
      const response = await fetch('http://localhost:5001/api/rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Bỏ cache để lấy dữ liệu mới nhất
      });
      const data = await response.json();
      console.log('Phản hồi GET /api/rooms:', data);
      if (!response.ok) {
        throw new Error(data.message || `Lỗi HTTP ${response.status}`);
      }
      if (Array.isArray(data)) {
        console.log('Dữ liệu phòng:', data);
        setSeats(data);
        setError(null);
      } else {
        console.error('Dữ liệu phòng không hợp lệ:', data);
        setError('Dữ liệu phòng không hợp lệ');
      }
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu chỗ ngồi:', err);
      setError(err.message || 'Lỗi kết nối server');
    }
  };

  // Kiểm tra UserContext
  useEffect(() => {
    if (!context) {
      console.error('UserContext không được cung cấp');
      setError('Lỗi hệ thống: UserContext không khả dụng');
    }
  }, [context]);

  // Lấy danh sách phòng khi component mount
  useEffect(() => {
    if (isLoading) return;

    if (!userData || !userData.username) {
      console.error('userData không hợp lệ hoặc thiếu username:', userData);
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      navigate('/');
      return;
    }

    fetchSeats();
  }, [userData, isLoading, navigate]);

  // Lọc danh sách phòng
  useEffect(() => {
    const filtered = seats.filter((seat) =>
      seat.buildingRoom?.toLowerCase().includes(search.toLowerCase()) &&
      (campus === '' || seat.campus?.toString() === campus) &&
      (status === '' || seat.status === status) &&
      (startTime === '' || seat.startTime === startTime) &&
      (endTime === '' || seat.endTime === endTime)
    );
    console.log('Danh sách phòng lọc:', filtered);
    setFilteredSeats(filtered);
    setCurrentPage(1);
  }, [search, campus, status, startTime, endTime, seats]);

  const totalPages = Math.ceil(filteredSeats.length / rowsPerPage);
  const pageSeats = filteredSeats.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Xử lý chọn phòng
  const handleSelect = (seat) => {
    if (!userData || !userData.username) {
      console.error('userData không hợp lệ trong handleSelect:', userData);
      setError('Thông tin người dùng không hợp lệ');
      return;
    }
    if (seat.status !== 'Trống') {
      console.warn('Không thể chọn phòng không ở trạng thái Trống:', seat);
      setError('Chỉ có thể chọn phòng ở trạng thái Trống');
      return;
    }
    const confirmBooking = confirm(`Bạn có chắc muốn chọn chỗ ở phòng ${seat.buildingRoom}, ${userData.username}?`);
    if (confirmBooking) {
      console.log('Lưu selectedRoom:', seat);
      sessionStorage.setItem('selectedRoom', JSON.stringify(seat));
      navigate('/booking');
    } else {
      console.log('Người dùng hủy chọn phòng:', seat);
    }
  };

  // Xử lý làm mới danh sách
  const handleRefresh = () => {
    setSeats([]); // Xóa danh sách cũ để tránh hiển thị dữ liệu cũ
    fetchSeats();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-[3000]">
        <div className="spinner border-4 border-t-primary rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1e1e2f] text-white min-h-screen p-5 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lỗi</h2>
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded"
            onClick={() => navigate('/dashboard')}
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e2f] text-white min-h-screen p-5">
      <h1 className="text-center text-3xl font-bold mb-6">DANH SÁCH CHỖ NGỒI</h1>

      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          onClick={() => navigate('/dashboard')}
        >
          Quay lại Dashboard
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleRefresh}
        >
          Làm mới
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-5">
        <div className="relative">
          <input
            type="text"
            className="p-2 pl-3 pr-10 rounded text-black"
            placeholder="Tìm theo phòng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={campus} onChange={(e) => setCampus(e.target.value)} className="p-2 rounded text-black">
          <option value="">Tất cả cơ sở</option>
          <option value="1">Cơ sở 1</option>
          <option value="2">Cơ sở 2</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded text-black">
          <option value="">Tất cả trạng thái</option>
          <option value="Trống">Chỗ trống</option>
          <option value="Đầy">Đã đầy</option>
          <option value="Bảo trì">Bảo trì</option>
        </select>

        <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-2 rounded text-black">
          <option value="">Giờ bắt đầu</option>
          <option value="06:00">06:00</option>
          <option value="08:00">08:00</option>
          <option value="10:00">10:00</option>
          <option value="12:00">12:00</option>
          <option value="14:00">14:00</option>
          <option value="16:00">16:00</option>
          <option value="18:00">18:00</option>
          <option value="20:00">20:00</option>
        </select>

        <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-2 rounded text-black">
          <option value="">Giờ kết thúc</option>
          <option value="07:50">07:50</option>
          <option value="09:50">09:50</option>
          <option value="11:50">11:50</option>
          <option value="13:50">13:50</option>
          <option value="15:50">15:50</option>
          <option value="17:50">17:50</option>
          <option value="19:50">19:50</option>
          <option value="21:50">21:50</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-black bg-white rounded">
          <thead>
            <tr className="bg-yellow-400">
              <th className="p-2">Cơ sở</th>
              <th className="p-2">Tòa - Phòng</th>
              <th className="p-2">Giờ bắt đầu</th>
              <th className="p-2">Giờ kết thúc</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {pageSeats.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Không có kết quả phù hợp
                </td>
              </tr>
            ) : (
              pageSeats.map((seat, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2">{seat.campus}</td>
                  <td className="p-2">{seat.buildingRoom}</td>
                  <td className="p-2">{seat.startTime}</td>
                  <td className="p-2">{seat.endTime}</td>
                  <td className="p-2">{seat.status}</td>
                  <td className="p-2">
                    <button
                      className={`rounded px-3 py-1 text-white ${
                        seat.status === 'Trống' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => handleSelect(seat)}
                      disabled={seat.status !== 'Trống'}
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
        <button
          className="px-4 py-2 bg-yellow-400 rounded disabled:bg-gray-500"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>

        <span className="leading-8">Trang {currentPage} / {totalPages || 1}</span>

        <button
          className="px-4 py-2 bg-yellow-400 rounded disabled:bg-gray-500"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}