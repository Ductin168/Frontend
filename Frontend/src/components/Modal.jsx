import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import logo from "../assets/images/logobachkhoa.png";

const Modal = ({ onForgotPasswordClick }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Bắt đầu đăng nhập với username:", username);

    if (!username || !password) {
      console.warn("Thiếu username hoặc password");
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    try {
      console.log("Gửi yêu cầu đến API /login...");
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Phản hồi từ API /login:", data);

      if (response.ok) {
        console.log("Đăng nhập thành công, lưu token:", data.token);
        sessionStorage.setItem("authToken", data.token);
        // Lưu thông tin người dùng vào Context
        setUserData({
          username: data.username,
          role: data.role,
          Name: data.Name,
          MSSV: data.MSSV,
          SDT: data.SDT,
          Class: data.Class,
          email: data.email,
        });
        closeModal();
        navigate("/dashboard");
      } else {
        console.error("Lỗi đăng nhập:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi mạng khi gọi API /login:", error.message);
      alert("Lỗi server, vui lòng thử lại sau");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;

    console.log("Bắt đầu yêu cầu quên mật khẩu với username:", username);

    if (!username) {
      console.warn("Thiếu username");
      alert("Vui lòng nhập tên đăng nhập");
      return;
    }

    try {
      console.log("Gửi yêu cầu đến API /forgot-password...");
      const response = await fetch("http://localhost:5001/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      console.log("Phản hồi từ API /forgot-password:", data);

      if (response.ok) {
        console.log("Yêu cầu quên mật khẩu thành công");
        alert("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
        closeModal();
      } else {
        console.error("Lỗi quên mật khẩu:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi mạng khi gọi API /forgot-password:", error.message);
      alert("Lỗi server, vui lòng thử lại sau");
    }
  };

  const closeModal = () => {
    console.log("Đóng modal");
    document.getElementById("loginModal").style.display = "none";
    setIsForgotPassword(false);
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div
      id="loginModal"
      className="modal hidden fixed inset-0 w-full h-full bg-black/50 z-[2000] flex justify-center items-center"
    >
      <div className="blur-circle left absolute w-[300px] h-[300px] bg-[rgba(163,223,250,0.5)] rounded-full blur-[80px] z-0"></div>
      <div className="blur-circle right absolute w-[400px] h-[400px] bg-[rgba(163,223,250,0.5)] rounded-full blur-[80px] z-0"></div>

      <div
        id="loginContent"
        className="modal-content bg-white p-[30px] rounded-[10px] w-full max-w-[450px] max-h-[450px] relative shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-[1]"
      >
        <span
          id="closeModal"
          onClick={closeModal}
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
        <h2 className="text-[24px] text-[#333] mb-[20px] text-center">
          {isForgotPassword ? 'Quên mật khẩu' : 'Đăng nhập'}
        </h2>
        <form
          id="loginForm"
          onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleLoginSubmit}
          className="flex flex-col gap-[15px]"
        >
          <label htmlFor="username" className="text-[14px] text-[#333]">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Mã sinh viên hoặc UID đăng nhập"
            className="p-[10px] border border-[#ccc] rounded-[5px] text-[14px] w-full box-border"
          />
          {!isForgotPassword && (
            <>
              <label htmlFor="password" className="text-[14px] text-[#333]">
                Mật khẩu
              </label>
              <div className="password-container relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Mật khẩu"
                  className="p-[10px] border border-[#ccc] rounded-[5px] text-[14px] w-full box-border"
                />
                <span
                  onClick={togglePassword}
                  className="toggle-password absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer text-[16px]"
                >
                  {passwordVisible ? "👁️‍🗨️" : "👁️"}
                </span>
              </div>
            </>
          )}
          {!isForgotPassword && (
            <a
              href="#"
              id="showForgotPassword"
              onClick={() => setIsForgotPassword(true)}
              className="forgot-password text-[14px] text-primary text-right block hover:underline"
            >
              Quên mật khẩu?
            </a>
          )}
          <button
            type="submit"
            className="modal-login-btn p-[10px] bg-primary text-white border-none rounded-[5px] cursor-pointer text-[16px] font-bold hover:bg-secondary transition-colors duration-300 ease-in-out"
          >
            {isForgotPassword ? 'Gửi yêu cầu' : 'Đăng nhập'}
          </button>
          {isForgotPassword && (
            <a
              href="#"
              onClick={() => setIsForgotPassword(false)}
              className="back-to-login text-[14px] text-primary text-center block hover:underline"
            >
              Quay lại đăng nhập
            </a>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modal;