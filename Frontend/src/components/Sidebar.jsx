import { useState, useEffect, useRef } from "react";

const Sidebar = ({ onActionClick, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleActionClick = (action) => {
    onActionClick(action);
    setIsOpen(false);
  };

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

  return (
    <>
      <button
        ref={menuBtnRef}
        id="menuBtn"
        onClick={() => setIsOpen(!isOpen)}
        className="menu-btn fixed top-[70px] left-[20px] bg-primary border-none text-[20px] text-white p-[8px_12px] rounded-[6px] z-[950] hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        ☰
      </button>
      <div
        ref={sidebarRef}
        id="sidebar"
        className={`sidebar fixed top-[60px] left-0 w-full h-auto bg-white shadow-[0_2px_15px_rgba(0,0,0,0.1)] z-[900] transform transition-transform duration-300 ease-in-out p-[20px] ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="menu-columns flex justify-between max-w-[1200px] mx-auto gap-[20px]">
          {role === "student" && (
            <div className="menu-column flex-1 min-w-[250px]">
              <h3 className="column-title text-[18px] font-bold text-[#333] mb-[10px] p-[10px_0] border-b-2 border-primary">
                Sinh Viên
              </h3>
              <ul className="submenu list-none p-0 m-0">
                {studentActions.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleActionClick({ type: "student", action: item })}
                    className="p-[8px_0] text-[14px] text-[#333] hover:bg-[rgba(0,0,0,0.02)] cursor-pointer transition-colors duration-300 ease-in-out"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {role === "admin" && (
            <div className="menu-column flex-1 min-w-[250px]">
              <h3 className="column-title admin-item text-[18px] font-bold text-admin mb-[10px] p-[10px_0] border-b-2 border-primary">
                Admin
              </h3>
              <ul className="submenu list-none p-0 m-0">
                {adminActions.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleActionClick({ type: "admin", action: item })}
                    className="admin-item p-[8px_0] text-[14px] text-admin hover:bg-[rgba(0,0,0,0.02)] cursor-pointer transition-colors duration-300 ease-in-out"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="menu-column flex-1 min-w-[250px]">
            <h3 className="column-title text-[18px] font-bold text-[#333] mb-[10px] p-[10px_0] border-b-2 border-primary">
              Thông tin hệ thống
            </h3>
            <ul className="submenu list-none p-0 m-0">
              <li className="p-[8px_0] text-[14px]">
                <a href="https://lib.hcmut.edu.vn" className="text-[#333] hover:text-secondary">
                  Truy cập website
                </a>
              </li>
              <li className="p-[8px_0] text-[14px]">
                <a href="mailto:support@hcmut.edu.vn" className="text-[#333] hover:text-secondary">
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;