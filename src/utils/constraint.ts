export const getNotificationOrderMessage = (id: string, type: string) => {
  switch (type) {
    case "PENDING":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} vừa được đặt. Vui lòng kiểm tra và xác nhận.`;
    case "DELIVERING":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đang giao. Vui lòng theo dôi lộ trình đơn hàng.`;
    case "REJECTED":
      return `Chúng tôi nhận thấy đơn hàng #${id.toUpperCase().substring(0, 6)} đáng nghi. Vui lòng kiểm tra lại.`;
    case "APPROVED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã được xác nhận. Hãy theo dõi lộ trình đơn hàng.`;
    case "COMPLETED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã hoàn tất. Hãy gửi lời đánh giá ngay nào.`;
    case "FAILED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã bị hủy do gặp sự cố không mong muốn. Rất mong quý khách thông cảm.`;
    default:
      return `Không xác định được nội dung thông báo`;
  }
};

export const getMessage = (key: string) => {
  switch (key.toLowerCase()) {
    // message
    case "a12":
      return "Địa chỉ không hợp lệ. Cửa hàng chỉ nhận giao hàng địa chỉ dưới 5km.";
    case "cm02":
      return "Vui lòng đăng nhập để có thể thao tác được chức năng này.";
    case "cm03":
      return "Vui lòng đăng nhập để có thể thao tác được chức năng này.";
    case "u07":
      return "Bạn không thể tạo tài khoản với email này. Do Email đã tồn tại trong hệ thống.";

    default:
      return "Không xác định";
  }
};
