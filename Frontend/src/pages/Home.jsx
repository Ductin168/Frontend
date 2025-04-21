import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Carousel from "../components/Carousel.jsx";
import Modal from "../components/Modal.jsx";
import ForgotPassword from "../components/ForgotPassword.jsx";

const Home = () => {
  const [forgotPasswordData, setForgotPasswordData] = useState(null); // Lưu dữ liệu từ form Quên mật khẩu
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // Quản lý trạng thái mở modal Quên mật khẩu

  useEffect(() => {
    // Reset trạng thái hiển thị của modal Đăng nhập khi trang Home được mount
    const loginModal = document.getElementById("loginModal");
    if (loginModal) {
      loginModal.style.display = "none";
    }

    // Thêm sự kiện đóng modal Đăng nhập khi nhấn ra ngoài
    const handleClickOutsideLogin = (event) => {
      if (event.target === loginModal) {
        loginModal.style.display = "none";
      }
    };
    window.addEventListener("click", handleClickOutsideLogin);

    // Thêm sự kiện đóng modal Quên mật khẩu khi nhấn ra ngoài
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const handleClickOutsideForgotPassword = (event) => {
      if (event.target === forgotPasswordModal) {
        setIsForgotPasswordOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutsideForgotPassword);

    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener("click", handleClickOutsideLogin);
      window.removeEventListener("click", handleClickOutsideForgotPassword);
    };
  }, []);

  const handleForgotPasswordSubmit = ({ username, email }) => {
    // Lưu dữ liệu từ form Quên mật khẩu để có thể sử dụng cho backend
    setForgotPasswordData({ username, email });
    // Bạn có thể thêm logic gọi API backend ở đây, ví dụ:
    // fetch("/api/forgot-password", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ username, email }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log("Phản hồi từ backend:", data))
    //   .catch((error) => console.error("Lỗi khi gọi API:", error));
  };

  return (
    <>
      <Header />
      <main id="mainContent" className="mt-[80px] p-[20px] text-center">
        <div id="homeContent">
          <Carousel />
          <section id="intro" className="section max-w-[1200px] mx-auto p-[20px] text-left">
            <h2 className="text-[28px] text-primary mb-[15px]">Giới thiệu</h2>
            <p className="text-[16px] leading-[1.6] text-[#333]">
              Thư viện Bách Khoa, thuộc Đại học Bách Khoa - Đại học Quốc gia TP.HCM (HCMUT), là trung tâm tri thức hiện
              đại, nơi đáp ứng nhu cầu học tập, nghiên cứu và làm việc nhóm ngày càng tăng của sinh viên. Với mục tiêu
              nâng cao trải nghiệm học tập, Thư viện Bách Khoa đã triển khai Hệ thống Quản lý và Đặt chỗ Không gian Tự học
              Thông minh (SMRS). SMRS không chỉ giúp sinh viên dễ dàng tìm kiếm và sử dụng các không gian học tập mà còn
              tối ưu hóa việc quản lý tài nguyên, tích hợp công nghệ IoT, mang đến một môi trường giáo dục tiên tiến và
              cạnh tranh.
            </p>
            <p className="text-[16px] leading-[1.6] text-[#333] mt-2">
              Sinh viên có thể truy cập hệ thống qua web và ứng dụng di động để đặt chỗ linh hoạt, nhận thông báo nhắc nhở
              và kiểm tra trạng thái không gian học tập theo thời gian thực. Nhờ tích hợp IoT, hệ thống tự động điều khiển
              thiết bị và giải phóng không gian không sử dụng, góp phần hiện đại hóa môi trường học tập.
            </p>
          </section>
          <section id="services" className="section max-w-[1200px] mx-auto p-[20px] text-left">
            <h2 className="text-[28px] text-primary mb-[15px]">Dịch vụ</h2>
            <p className="text-[16px] leading-[1.6] text-[#333]">
              Chúng tôi cung cấp các dịch vụ như mượn sách, truy cập tài liệu số, và hỗ trợ nghiên cứu. Hãy khám phá để
              biết thêm chi tiết!
            </p>
          </section>
          {/* Hiển thị dữ liệu từ form Quên mật khẩu (tùy chọn, để kiểm tra) */}
          {forgotPasswordData && (
            <div className="forgot-password-data mt-[20px] p-[15px] bg-white rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] text-[16px] text-[#333] text-center">
              Dữ liệu Quên mật khẩu: Tên đăng nhập - {forgotPasswordData.username}, Email -{" "}
              {forgotPasswordData.email}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Modal onForgotPasswordClick={() => setIsForgotPasswordOpen(true)} />
      {isForgotPasswordOpen && (
        <ForgotPassword
          onClose={() => setIsForgotPasswordOpen(false)}
          onSubmit={handleForgotPasswordSubmit}
        />
      )}
    </>
  );
};

export default Home;