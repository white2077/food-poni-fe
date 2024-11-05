import { Typography } from "antd";
import { OrderStatusLabel } from "../atoms/OrderStatusLabel";

const { Title } = Typography;

export const OrderHeader = ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => (
  <>
    <Title level={3}>
      Đơn hàng chi tiết #{orderId?.toUpperCase()?.substring(0, 7)}
    </Title>
    <OrderStatusLabel status={status} />
  </>
);
