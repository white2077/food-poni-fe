import { Card, Divider, Typography } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const { Text } = Typography;

export function OrderInfoCard() {
  const { selectedOrder } = useSelector((state: RootState) => state.order);

  if (!selectedOrder) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-5 rounded-lg">
      <Card>
        <div>
          <h3 className="font-bold text-primary text-xl">ĐỊA CHỈ NGƯỜI NHẬN</h3>
          <Divider></Divider>
          <div className="font-bold mb-2">
            <Text>{selectedOrder.shippingAddress.fullName}</Text>
          </div>
          <div className="mb-2">
            <Text>Địa chỉ: {selectedOrder.shippingAddress.address}</Text>
          </div>
          <div>
            <Text>
              Số điện thoại: {selectedOrder.shippingAddress.phoneNumber}
            </Text>
          </div>
        </div>
      </Card>
      <Card>
        <div>
          <h3 className="font-bold text-primary text-xl">
            HÌNH THỨC GIAO HÀNG
          </h3>
          <Divider></Divider>
          <div className="mb-2">
            <Text>Giao hàng nhanh</Text>
          </div>
          <div className="mb-2">
            <Text>Giao vào thứ 5, 11/11</Text>
          </div>
          <div className="mb-2">
            <Text>Được giao bởi ????</Text>
          </div>
          <div>
            <Text>Phí vận chuyển: {selectedOrder.shippingFee}đ</Text>
          </div>
        </div>
      </Card>
      <Card>
        <div>
          <h3 className="font-bold text-primary text-xl">
            HÌNH THỨC THANH TOÁN
          </h3>
          <Divider></Divider>
          <div className="flex items-center">
            <img
              src={
                selectedOrder.payment.method?.includes("CASH")
                  ? "/tien-mat.png"
                  : "/VNP.png"
              }
              className="w-9 h-9 mr-2"
              alt="Payment method"
            />
            <Text>
              {selectedOrder.payment.method?.includes("CASH")
                ? "Tiền mặt"
                : "VNPAY"}
            </Text>
            {selectedOrder.status === "POST_PAID" && (
              <span className="text-red-500 px-1 ">/ chưa thanh toán</span>
            )}
            {!selectedOrder.payment.method?.includes("CASH") && (
              <>
                <span className="mx-2">/</span>
                {selectedOrder.payment.status === "PAID" && (
                  <span className="text-green-500">Đã thanh toán</span>
                )}
                {selectedOrder.payment.status === "PAYING" && (
                  <span className="text-yellow-500">Đang thanh toán</span>
                )}
                {selectedOrder.payment.status === "FAILED" && (
                  <span className="text-red-500">Thanh toán thất bại</span>
                )}
              </>
            )}
          </div>
          {selectedOrder.payment.paymentUrl && (
            <div className="flex items-center mt-1">
              <img src={"/link.png"} className="w-6 h-6 ml-2 mr-3" alt="" />
              <a
                href={selectedOrder.payment.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-orange-500"
              >
                Link thanh toán
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
