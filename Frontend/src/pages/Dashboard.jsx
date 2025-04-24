import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import QuickActions from "../components/QuickActions.jsx";
import LogoutConfirmation from "../components/LogoutConfirmation.jsx";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    username: "",
    role: "",
    sessionValid: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      redirectToLogin("Vui lòng đăng nhập để truy cập dashboard");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.sessionValid && data.username && data.role) {
          setUserData({
            username: data.username,
            role: data.role,
            sessionValid: true,
          });
        } else {
          redirectToLogin(data.message || "Phiên đăng nhập không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error.message);
        redirectToLogin("Phiên đăng nhập không còn tồn tại hoặc server lỗi.");
      } finally {
        setIsLoading(false);
      }
    };

    const redirectToLogin = (message) => {
      setErrorMessage(message);
      sessionStorage.removeItem("authToken");
      setTimeout(() => navigate("/"), 1500);
    };

    fetchUserData();
  }, [navigate]);

  const handleActionClick = ({ type, action }) => {
    if (!userData.sessionValid) {
      setActionMessage("⚠️ Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }
  
    if (userData.role === "student" && type === "admin") {
      setActionMessage("❌ Bạn không có quyền truy cập chức năng dành cho admin.");
      return;
    }
  
    // ✅ Điều hướng đến trang web mẫu tùy theo loại và hành động
    const pageSlug = action.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${type}/${pageSlug}`);
  };
  

  const handleLogout = async () => {
    const token = sessionStorage.getItem("authToken");

    try {
      await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Lỗi khi logout:", err.message);
    }

    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <>
      <Header
        isDashboard
        userName={userData.username}
        onLogoutClick={() => setIsLogoutConfirmationOpen(true)}
      />
      <main className="dashboard-main p-[130px_20px_20px] bg-gradient-to-br from-[#e6f0fa] to-[#f7f9fc] min-h-[calc(100vh-200px)] relative">
        {isLoading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-[3000]">
            <div className="spinner border-4 border-t-primary rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : errorMessage ? (
          <div className="error-message mb-[20px] p-[15px] bg-red-100 rounded-[10px] text-[16px] text-red-600 text-center">
            {errorMessage}
          </div>
        ) : (
          <>
            <Sidebar onActionClick={handleActionClick} role={userData.role} />
            <div className="dashboard-container max-w-[1200px] mx-auto">
              <div className="welcome-section text-center mb-[40px] p-[20px] bg-white rounded-[15px] shadow">
                <h2 className="text-[28px] text-primary font-semibold mb-[10px]">
                  Xin chào, {userData.username}! 👋
                </h2>
                <p className="text-[16px] text-[#666]">
                  Chào mừng bạn đến với SMRS - Hệ thống quản lý không gian học tập tại Thư viện Bách Khoa.
                </p>
              </div>

              <div className="quick-info flex justify-between gap-[20px] mb-[40px]">
                {[
                  { title: "Đặt chỗ hôm nay", value: "5" },
                  { title: "Không gian trống", value: "12" },
                  { title: "Thông báo mới", value: "2" },
                ].map((info) => (
                  <div
                    key={info.title}
                    className="info-card flex-1 bg-white rounded-[10px] p-[20px] text-center shadow"
                  >
                    <h3 className="text-[16px] text-[#333] mb-[10px] font-medium">{info.title}</h3>
                    <p className="info-value text-[24px] font-bold text-primary">{info.value}</p>
                  </div>
                ))}
              </div>

              {actionMessage && (
                <div className="action-message mb-[20px] p-[15px] bg-white rounded-[10px] shadow text-[16px] text-[#333] text-center">
                  {actionMessage}
                </div>
              )}

              <QuickActions type="student" onActionClick={handleActionClick} />
              <QuickActions type="admin" onActionClick={handleActionClick} />

              <div className="recent-notifications bg-white rounded-[15px] p-[20px] shadow mt-[40px]">
                <h2 className="text-[24px] text-primary mb-[20px] relative pb-[10px] border-b border-primary/30">
                  Thông báo gần đây
                </h2>
                <ul className="notification-list list-none p-0 m-0">
                  {[
                    { icon: "📢", text: "Đặt chỗ của bạn sắp hết giờ (15:00)." },
                    { icon: "ℹ️", text: "Không gian B1-203 đã trống." },
                  ].map((notification) => (
                    <li
                      key={notification.text}
                      className="p-[15px_0] text-[14px] text-[#333] border-b last:border-b-0 flex items-center gap-[10px] hover:bg-gray-50 transition-colors duration-300"
                    >
                      <span className="notification-icon text-[18px]">{notification.icon}</span>
                      {notification.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      {isLogoutConfirmationOpen && (
        <LogoutConfirmation
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmationOpen(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
