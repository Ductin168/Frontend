import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logobachkhoa.png";

const Header = ({ isDashboard = false, userName = "", onLogoutClick }) => {
  const navigate = useNavigate();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const showModal = () => {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.style.display = "flex";
      const loginContent = document.getElementById("loginContent");
      if (loginContent) {
        loginContent.style.display = "block";
      }
    }
  };

  return (
    <header
      className={`${
        isDashboard ? "dashboard-header h-[60px] p-[10px_20px]" : "p-[15px_20px]"
      } bg-primary text-white fixed top-0 w-full shadow-[0_2px_5px_rgba(0,0,0,0.1)] z-[1000]`}
    >
      <div className="header-container flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="logo-title flex items-center gap-[15px]">
          <img src={logo} alt="Logo Bách Khoa" className={`logo ${isDashboard ? "w-[50px]" : "w-[60px]"} h-auto`} />
          <div className="title-container">
            <h1 className={`site-title m-0 font-bold ${isDashboard ? "text-[18px]" : "text-[22px]"}`}>SMRS</h1>
            <span className="subtitle text-[12px]">Thư viện Bách Khoa</span>
          </div>
        </div>
        <div className={`nav-links flex items-center ${isDashboard ? "gap-[15px]" : "gap-[20px]"}`}>
          {isDashboard ? (
            <>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="nav-item text-white text-[14px] font-bold hover:text-secondary transition-colors duration-300 ease-in-out"
              >
                Liên hệ
              </a>
              <span className="user-name text-white text-[16px] font-bold flex items-center gap-[6px]">
                👤 {userName}
              </span>
              <button
                id="logoutBtn"
                onClick={onLogoutClick} // Gọi hàm onLogoutClick để hiển thị modal xác nhận
                className="logout-btn p-[6px_15px] bg-white/20 text-white border-2 border-white rounded-[20px] font-bold text-[14px] hover:bg-[#ff4d4f] hover:border-[#ff4d4f] hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <a
                href="#intro"
                onClick={(e) => handleNavClick(e, "#intro")}
                className="nav-item text-white text-[16px] font-bold hover:text-secondary transition-colors duration-300 ease-in-out"
              >
                Giới thiệu
              </a>
              <a
                href="#services"
                onClick={(e) => handleNavClick(e, "#services")}
                className="nav-item text-white text-[16px] font-bold hover:text-secondary transition-colors duration-300 ease-in-out"
              >
                Dịch vụ
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="nav-item text-white text-[16px] font-bold hover:text-secondary transition-colors duration-300 ease-in-out"
              >
                Liên hệ
              </a>
              <button
                id="loginBtn"
                onClick={showModal}
                className="login-btn p-[8px_20px] bg-secondary text-white border-none rounded-[4px] cursor-pointer font-bold hover:bg-[#008BB5] transition-colors duration-300 ease-in-out"
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;