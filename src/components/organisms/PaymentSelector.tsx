import { Card, Radio, RadioChangeEvent, Space, Tooltip } from "antd";

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
            <p>Thanh toán khi nhận hàng</p>
          </div>
        </Radio>
        <Radio value="VNPAY">
          <Tooltip title="Khách hàng có thể thanh toán trước khi nhận hàng. Chúng tôi hỗ trợ hoàn đầy đủ số tiền đối với trường hợp phía cửa hàng giao hàng không thành công.">
            <div className="flex items-center">
              <img src="/vnpay.png" className="w-9 h-9 mr-2" />
              <div>
                <p>VNPAY</p>
                <div className="text-gray-400">
                  Quét Mã QR từ ứng dụng ngân hàng
                </div>
              </div>
            </div>
          </Tooltip>
        </Radio>
        {currentUserRole === "VIP" && (
          <Radio value="POSTPAID">
            <Tooltip title="Bạn là một khách hàng vô cùng thân thiết. Nên bạn có thể ghi nợ và trả sau theo theo đợt.">
              <div className="flex items-center">
                <img src="/post-paid.png" className="w-9 h-9 mr-2" />
                <div>
                  <p>Ghi nợ</p>
                  <div className="text-gray-400">Cho phép trả sau</div>
                </div>
              </div>
            </Tooltip>
          </Radio>
        )}
      </Space>
    </Radio.Group>
  </Card>
);
