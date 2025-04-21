import { useParams } from "react-router-dom";

const StudentPage = () => {
  const { action } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-primary">Trang Sinh Viên</h1>
      <p>Bạn đang ở mục: <strong>{action.replace(/-/g, " ")}</strong></p>
    </div>
  );
};

export default StudentPage;
