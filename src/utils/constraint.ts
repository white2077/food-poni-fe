export const getNotificationOrderMessage = (id: string, type: string) => {
  switch (type) {
    case "PENDING":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} vừa được đặt. Vui lòng kiểm tra và xác nhận.`;
    case "REJECTED":
      return `Chúng tôi nhận thấy đơn hàng #${id.toUpperCase().substring(0, 6)} đáng nghi. Vui lòng kiểm tra lại.`;
    case "APPROVED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã được xác nhận. Hãy theo dõi lộ trình đơn hàng.`;
    case "COMPLETED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã hoàn tất. Hãy gửi lời đánh giá ngay nào.`;
    default:
      return `Không xác định được nội dung thông báo`;
  }
};
