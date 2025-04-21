const Footer = () => {
  return (
    <footer id="contact" className="footer bg-primary text-white p-[40px_20px] text-center">
      <div className="footer-container max-w-[1200px] mx-auto">
        <h2 className="text-[28px] mb-[20px]">Liên hệ</h2>
        <div className="contact-info flex justify-between flex-wrap gap-[20px]">
          <div className="contact-item flex-1 min-w-[250px] text-left">
            <h3 className="text-[18px] mb-[10px]">Địa điểm</h3>
            <p className="text-[14px] leading-[1.6] m-0">
              Thư viện Bách Khoa, Tòa nhà B1, Đại học Bách Khoa - ĐHQG TP.HCM
              <br />
              268 Lý Thường Kiệt, Phường 14, Quận 10, TP. Hồ Chí Minh
            </p>
          </div>
          <div className="contact-item flex-1 min-w-[250px] text-left">
            <h3 className="text-[18px] mb-[10px]">Thời gian làm việc</h3>
            <p className="text-[14px] leading-[1.6] m-0">
              Thứ Hai - Thứ Sáu: 7:30 - 17:00
              <br />
              Thứ Bảy: 7:30 - 12:00
              <br />
              Chủ Nhật: Nghỉ
            </p>
          </div>
          <div className="contact-item flex-1 min-w-[250px] text-left">
            <h3 className="text-[18px] mb-[10px]">Thông tin liên hệ</h3>
            <p className="text-[14px] leading-[1.6] m-0">
              Email:{" "}
              <a href="mailto:library@hcmut.edu.vn" className="text-secondary hover:underline">
                library@hcmut.edu.vn
              </a>
              <br />
              Điện thoại: (028) 3865 1234
              <br />
              Website:{" "}
              <a href="https://lib.hcmut.edu.vn" className="text-secondary hover:underline">
                lib.hcmut.edu.vn
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;