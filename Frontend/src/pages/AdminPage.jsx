import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminPage = () => {
  const { action } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("authToken");

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/user", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const data = await response.json();
        if (data.role !== "admin") {
          alert("❌ Bạn không có quyền truy cập trang Admin.");
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Lỗi xác thực:", err.message);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="p-[40px] max-w-[800px] mx-auto">
      <h1 className="text-3xl font-bold text-admin mb-4">Trang quản trị</h1>
      <p className="text-lg text-[#444] mb-6">
        Bạn đang truy cập chức năng:{" "}
        <span className="font-semibold text-primary">{action.replace(/-/g, " ")}</span>
      </p>

      <div className="bg-white p-6 rounded-[10px] shadow">
        <p className="text-[16px] text-[#333]">
          Đây là trang mô phỏng cho chức năng <strong>{action}</strong> dành cho admin. 
          Bạn có thể tùy chỉnh thêm nội dung, biểu đồ hoặc bảng quản trị tại đây.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
