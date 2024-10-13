export const getNotificationOrderMessage = (id: string, type: string) => {
    switch (type) {
        case "REJECTED":
            return `Chúng tôi nhận thấy đơn hàng #${id} đáng nghi. Vui lòng kiểm tra lại.`;
        case "APPROVED":
            return `Đơn hàng #${id} đã được xác nhận. Hãy theo dõi lộ trình đơn hàng.`;
        case "COMPLETED":
            return `Đơn hàng #${id} đã hoàn tất. Hãy gửi lời đánh giá ngay nào.`;
        default:
            return `Không xác định được nội dung thông báo`;
    }
}