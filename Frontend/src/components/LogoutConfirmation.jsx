const LogoutConfirmation = ({ onConfirm, onCancel }) => {
    return (
      <div
        id="logoutConfirmationModal"
        className="modal fixed inset-0 w-full h-full bg-black/50 z-[2000] flex justify-center items-center"
      >
        <div className="blur-circle left absolute w-[300px] h-[300px] bg-[rgba(163,223,250,0.5)] rounded-full blur-[80px] z-0"></div>
        <div className="blur-circle right absolute w-[400px] h-[400px] bg-[rgba(163,223,250,0.5)] rounded-full blur-[80px] z-0"></div>
  
        <div className="modal-content bg-white p-[30px] rounded-[10px] w-full max-w-[400px] relative shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-[1]">
          <span
            onClick={onCancel}
            className="close absolute top-[10px] right-[15px] text-[24px] cursor-pointer text-[#333] z-[2]"
          >
          </span>
          <h2 className="text-[24px] text-[#333] mb-[20px] text-center">Xác nhận đăng xuất</h2>
          <p className="text-[16px] text-[#333] mb-[20px] text-center">
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
          </p>
          <div className="flex justify-center gap-[15px]">
            <button
              onClick={onConfirm}
              className="p-[10px_20px] bg-primary text-white border-none rounded-[5px] cursor-pointer text-[16px] font-bold hover:bg-secondary transition-colors duration-300 ease-in-out"
            >
              Có
            </button>
            <button
              onClick={onCancel}
              className="p-[10px_20px] bg-gray-300 text-[#333] border-none rounded-[5px] cursor-pointer text-[16px] font-bold hover:bg-gray-400 transition-colors duration-300 ease-in-out"
            >
              Không
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LogoutConfirmation;