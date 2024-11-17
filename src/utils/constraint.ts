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
