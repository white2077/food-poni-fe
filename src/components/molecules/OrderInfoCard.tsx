import { Order } from "@/type/types";
import {
  DollarCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Card, Divider, Typography } from "antd";

const { Text } = Typography;

export function OrderInfoCard({ selectedOrder }: { selectedOrder: Order }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4 bg-gray-100 p-5 rounded-lg">
      <Card>
        <div>
          <h3 className="font-bold text-primary text-xl">NGƯỜI NHẬN</h3>
          <Divider />
          <div className="font-bold mb-2">
            <Text>{selectedOrder.shippingAddress.fullName}</Text>
          </div>
          <div className="mb-2">
            <Text>
              <EnvironmentOutlined /> Địa chỉ:{" "}
              {selectedOrder.shippingAddress.address}
            </Text>
          </div>
          <div className="mb-2">
            <Text>
              <DollarCircleOutlined /> Khoảng cách:{" "}
              {selectedOrder.shippingAddress.distance / 1000}km
            </Text>
          </div>
          <div>
            <Text>
              <PhoneOutlined />
              Số điện thoại: {selectedOrder.shippingAddress.phoneNumber}
            </Text>
          </div>
        </div>
      </Card>
      <Card>
        <div>
          <h3 className="font-bold text-primary text-xl">THANH TOÁN</h3>
          <Divider />
          <div className="flex items-center">
            <img
              src={
                selectedOrder.payment.method === "CASH"
                  ? "/tien-mat.png"
                  : selectedOrder.payment.method === "VNPAY"
                    ? "/vnpay.png"
                    : "/post-paid.png"
              }
              className="w-9 h-9 mr-2"
              alt="Payment method"
            />
            <Text>
              {selectedOrder.payment.method === "CASH"
                ? "Tiền mặt"
                : selectedOrder.payment.method === "VNPAY"
                  ? "VNPAY"
                  : "Ghi nợ"}
            </Text>

            <span className="mx-2">/</span>
            {selectedOrder.payment.method === "VNPAY" && (
              <>
                {selectedOrder.payment.status === "PAID" && (
                  <span className="text-green-500">Đã thanh toán</span>
                )}
                {selectedOrder.payment.status === "PAYING" && (
                  <span className="text-yellow-500">Đang thanh toán</span>
                )}
              </>
            )}
            {selectedOrder.payment.method === "CASH" && (
              <span
                className={`${selectedOrder.status === "COMPLETED" ? "text-green-500" : "text-yellow-500"}`}
              >
                {selectedOrder.status === "COMPLETED"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </span>
            )}
            {selectedOrder.payment.status === "FAILED" && (
              <span className="text-red-500">Thanh toán thất bại</span>
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
