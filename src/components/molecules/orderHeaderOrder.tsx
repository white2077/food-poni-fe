import { Typography } from 'antd';

const { Title, Text } = Typography;

interface OrderHeaderProps {
    orderId: string;
    status: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ orderId, status }) => (
    <>
        <Title level={3}>Đơn hàng chi tiết #{orderId?.toUpperCase()?.substring(0, 7)}</Title>
        <div className="flex justify-between items-center mb-4">
            <Text strong className="text-lg">
                {status.includes("PENDING") ? 'Chờ xác nhận' :
                    status.includes("APPROVED") ? 'Chờ giao hàng' : 'Đơn hoàn tất'}
            </Text>
        </div>
    </>
);