import { useNavigate } from 'react-router-dom';

const QuickActions = ({ type, onActionClick }) => {
  const studentActions = [
    "Đặt chỗ học",
    "Check in & Check out",
    "Tìm kiếm",
    "Lịch sử đặt chỗ",
    "Đánh giá & phản hồi",
  ];
  const adminActions = [
    "Quản lý đặt chỗ",
    "Quản lý không gian",
    "Thống kê & báo cáo",
    "Quản lý phân hội",
  ];

  const actions = type === "student" ? studentActions : adminActions;
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    if (action === "Đặt chỗ học") {
      navigate('/dat-cho-hoc');
    } else {
      onActionClick({ type, action });
    }
  };

  return (
    <div
      className={`quick-actions ${
        type === "student" ? "student-actions mb-[60px]" : "admin-actions mb-[40px]"
      }`}
    >
      <h2 className="section-heading text-[24px] text-primary mb-[20px] relative pb-[10px] after:content-[''] after:w-[50px] after:h-[3px] after:bg-primary after:absolute after:bottom-0 after:left-0">
        Hành động nhanh - {type === "student" ? "Sinh Viên" : "Admin"}
      </h2>
      <div className="action-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => handleActionClick(action)}
            className={`action-btn p-[15px] border-none rounded-[8px] text-[15px] font-semibold text-white cursor-pointer transition-all duration-300 ease-in-out shadow-[0_3px_10px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] hover:shadow-[0_6px_15px_rgba(0,0,0,0.15)] hover:brightness-110 active:translate-y-0 active:shadow-[0_2px_5px_rgba(0,0,0,0.1)] ${
              type === "student"
                ? "student-action bg-gradient-to-br from-primary to-secondary"
                : "admin-action bg-gradient-to-br from-admin to-[#a48bff]"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;