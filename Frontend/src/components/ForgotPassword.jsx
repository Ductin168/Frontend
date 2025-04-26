import { useState } from "react";
import logo from "../assets/images/logobachkhoa.png";

const ForgotPassword = ({ onClose, onSubmit }) => {
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(""); // Trạng thái để lưu thông báo

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById("forgotUsername").value;
    const email = document.getElementById("email").value;
    const message = `Yêu cầu khôi phục mật khẩu đã được gửi cho tài khoản ${username} qua email ${email}. Vui lòng kiểm tra email của bạn!`;
    setForgotPasswordMessage(message); // Lưu thông báo vào state
    if (onSubmit) {
      onSubmit({ username, email }); // Gọi callback để truyền dữ liệu lên component cha (Home)
    }
    // Đóng modal sau 2 giây để người dùng có thời gian đọc thông báo
    setTimeout(() => {
      onClose(); // Đóng modal thông qua prop onClose
      setForgotPasswordMessage(""); // Reset thông báo
    }, 2000);
  };

  return (
    <div
      id="forgotPasswordModal"
      className="modal fixed inset-0 w-full h-full bg-black/50 z-[2000] flex justify-center items-center"
    >
      <div className="blur-circle left absolute w-[300px] h-[300px] bg-[rgba(163,223,250,0.5)] rounded-full blur-[80px] z-0"></div>
      <div className="blur-circle right absolute w-[400px] h-[400px] bg-[rgba(163,223,250,0.5)] rounded-full blur-[80px] z-0"></div>

      <div
        id="forgotPasswordContent"
        className="modal-content bg-white p-[30px] rounded-[10px] w-full max-w-[450px] max-h-[450px] relative shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-[1]"
      >
        <span
          onClick={() => {
            onClose();
            setForgotPasswordMessage(""); // Reset thông báo khi đóng
          }}
          className="close absolute top-[10px] right-[15px] text-[24px] cursor-pointer text-[#333] z-[2]"
        >
          ×
        </span>
        <div className="modal-header flex items-center gap-[15px] mb-[20px]">
          <img src={logo} alt="Logo Bách Khoa" className="modal-logo w-[50px] h-auto" />
          <div className="modal-title">
            <h1 className="text-[24px] text-primary m-0">SMRS</h1>
            <p className="text-[14px] text-primary m-0">SYSTEM</p>
          </div>
        </div>
        <h2 className="text-[24px] text-[#333] mb-[20px] text-center">Quên mật khẩu</h2>
        <form id="forgotPasswordForm" onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-[15px]">
          <label htmlFor="forgotUsername" className="text-[14px] text-[#333]">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="forgotUsername"
            name="forgotUsername"
            placeholder="Nhập tên đăng nhập"
            required
            className="p-[10px] border border-[#ccc] rounded-[5px] text-[14px] w-full box-border"
          />
          <label htmlFor="email" className="text-[14px] text-[#333]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Nhập email của bạn"
            required
            className="p-[10px] border border-[#ccc] rounded-[5px] text-[14px] w-full box-border"
          />
          <button
            type="submit"
            className="modal-login-btn p-[10px] bg-primary text-white border-none rounded-[5px] cursor-pointer text-[16px] font-bold hover:bg-secondary transition-colors duration-300 ease-in-out"
          >
            Gửi yêu cầu
          </button>
          {/* Hiển thị thông báo trong modal */}
          {forgotPasswordMessage && (
            <div className="forgot-password-message mt-[15px] p-[10px] bg-white rounded-[5px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] text-[14px] text-[#333] text-center">
              {forgotPasswordMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;