import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const NotFound = () => {
  return (
    <>
      <Header />
      <main className="mt-20 p-5 text-center">
        <h2 className="text-2xl text-primary mb-4">404 - Không tìm thấy trang</h2>
        <p className="text-base text-gray-700">
          Trang bạn đang tìm kiếm không tồn tại. Vui lòng quay lại trang chủ.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;