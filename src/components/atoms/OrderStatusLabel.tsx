
export const OrderStatusLabel = ({ status }: { status: string }) => (
  <div className="flex justify-between items-center mb-4">
    <h3>
      {status === "PENDING"
        ? "Chờ xác nhận"
        : status === "APPROVED"
          ? "Chờ giao hàng"
          : status === "POST_PAID"
            ? "Ghi nợ"
            : status === "REJECTED"
              ? "Đáng nghi"
              : status === "CANCELLED"
                ? "Đã hủy"
                : "Đơn hoàn tất"}
    </h3>
  </div>
);
