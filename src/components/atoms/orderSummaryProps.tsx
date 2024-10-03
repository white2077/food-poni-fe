interface OrderSummaryProps {
    totalAmount: number;
    shippingFee: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({ totalAmount, shippingFee }) => (
    <div className="flex justify-end items-center gap-8">
        <div className="text-right text-gray-500">
            <div className="mb-2">Tạm tính</div>
            <div className="mb-2">Phí vận chuyển</div>
            <div className="mb-2">Khuyến mãi vận chuyển</div>
            <div className="mb-2">Giảm giá</div>
            <div className="font-bold">Tổng cộng</div>
        </div>
        <div className="text-right">
            <div className="mb-2">{formatCurrency(totalAmount)}</div>
            <div className="mb-2">{formatCurrency(shippingFee)}</div>
            <div className="mb-2">0 ₫</div>
            <div className="mb-2">0 ₫</div>
            <div className="text-2xl text-orange-600 font-bold">
                {formatCurrency(totalAmount + shippingFee)}
            </div>
        </div>
    </div>
);