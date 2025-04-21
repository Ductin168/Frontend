import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logobachkhoa.png";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const [tokenError, setTokenError] = useState(""); // Thêm trạng thái lỗi token
  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  useEffect(() => {
    const token = getTokenFromUrl();
    console.log("Token từ URL:", token || "Không tìm thấy token");
    if (!token) {
      console.warn("Không tìm thấy token trong URL");
      setTokenError("Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
    }
  }, []); // Xóa navigate khỏi dependencies để tránh chuyển hướng ngay lập tức

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getTokenFromUrl();

    console.log("Bắt đầu đặt lại mật khẩu với token:", token);

    if (!token) {
      setMessage("Liên kết không hợp lệ. Vui lòng kiểm tra email hoặc yêu cầu lại.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      console.warn("Thiếu mật khẩu hoặc xác nhận mật khẩu");
      setMessage("Vui lòng nhập đầy đủ mật khẩu và xác nhận mật khẩu");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.warn("Mật khẩu và xác nhận mật khẩu không khớp");
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    setIsLoading(true); // Bật loading
    setMessage(""); // Xóa thông báo cũ

    try {
      console.log("Gửi yêu cầu đến API /reset-password...");
      const response = await fetch("http://localhost:5001/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      console.log("Phản hồi từ API /reset-password:", data);

      if (response.ok) {
        console.log("Đặt lại mật khẩu thành công");
        setMessage("Mật khẩu đã được đặt lại thành công. Bạn sẽ được chuyển hướng về trang đăng nhập.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        console.error("Lỗi đặt lại mật khẩu:", data.message);
        setMessage(data.message || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi mạng khi gọi API /reset-password:", error.message);
      setMessage("Lỗi server, vui lòng thử lại sau");
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#e6f0fa] to-[#f7f9fc]">
      <div className="bg-white p-[30px] rounded-[10px] w-full max-w-[450px] shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-[15px] mb-[20px]">
          <img src={logo} alt="Logo Bách Khoa" className="w-[50px] h-auto" />
          <div>
            <h1 className="text-[24px] text-primary m-0">SMRS</h1>
            <p className="text-[14px] text-primary m-0">SYSTEM</p>
          </div>
        </div>
        <h2 className="text-[24px] text-[#333] mb-[20px] text-center">Đặt lại mật khẩu</h2>
        {tokenError ? (
          <p className="text-[14px] text-center text-red-600 mb-[20px]">{tokenError}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
            <label htmlFor="newPassword" className="text-[14px] text-[#333]">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="p-[10px] border border-[#ccc] rounded-[5px] text-[14px] w-full box-border"
                disabled={isLoading} // Vô hiệu hóa khi đang loading
              />
              <span
                onClick={togglePassword}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer text-[16px]"
              >
                {passwordVisible ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
            <label htmlFor="confirmPassword" className="text-[14px] text-[#333]">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                className="p-[10px] border border-[#ccc] rounded-[5px] text-[14px] w-full box-border"
                disabled={isLoading} // Vô hiệu hóa khi đang loading
              />
              <span
                onClick={togglePassword}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer text-[16px]"
              >
                {passwordVisible ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
            {message && (
              <p
                className={`text-[14px] text-center ${
                  message.includes("thành công") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              className="p-[10px] bg-primary text-white border-none rounded-[5px] cursor-pointer text-[16px] font-bold hover:bg-secondary transition-colors duration-300 ease-in-out"
              disabled={isLoading} // Vô hiệu hóa nút khi đang loading
            >
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;