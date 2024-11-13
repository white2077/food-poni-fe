import { Card, Radio, RadioChangeEvent, Space } from "antd";

export const PaymentSelector = ({
  value,
  onSelected,
  currentUserRole,
}: {
  value: "CASH" | "VNPAY" | "POSTPAID" | "MOMO";
  onSelected: (value: "VNPAY" | "CASH" | "POSTPAID" | "MOMO") => void;
  currentUserRole: "VIP" | "CUSTOMER" | "RETAILER";
}) => (
  <Card className="mb-[16px]">
    <div>Thông tin thanh toán</div>
    <Radio.Group
      onChange={(e: RadioChangeEvent): void => onSelected(e.target.value)}
      defaultValue={value}
    >
      <Space direction="vertical">
        <Radio value="CASH">
          <div className="flex items-center">
            <img src="/tien-mat.png" className="w-9 h-9 mr-2" />
            <p>Thanh toán tiền mặt</p>
          </div>
        </Radio>
        <Radio value="VNPAY">
          <div className="flex items-center">
            <img src="/VNP.png" className="w-9 h-9 mr-2" />
            <div>
              <p>VNPAY</p>
              <div className="text-gray-400">
                Quét Mã QR từ ứng dụng ngân hàng
              </div>
            </div>
          </div>
        </Radio>
        {currentUserRole === "VIP" && (
          <Radio value="POSTPAID">
            <div className="flex items-center">
              <img src="/no-comment.png" className="w-9 h-9 mr-2" />
              <div>
                <p>Ghi nợ</p>
                <div className="text-gray-400">Cho phép trả sau</div>
              </div>
            </div>
          </Radio>
        )}
      </Space>
    </Radio.Group>
  </Card>
);
