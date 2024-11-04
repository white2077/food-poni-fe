import { buyAgainOrderAction } from "@/redux/modules/cart";
import { RootState } from "@/redux/store";
import { currencyFormat } from "@/utils/common";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface OrderSummaryProps {
  totalAmount: number;
  shippingFee: number;
}

export function OrderSummary({ totalAmount, shippingFee }: OrderSummaryProps) {
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector((state: RootState) => state.order);
  const { page } = useSelector((state: RootState) => state.cart);
  const { isBuyAgainLoading } = useSelector((state: RootState) => state.cart);

  const isAllItemsInCart = selectedOrder?.orderItems.every((orderItem) =>
    page.content.some((item) => {
      let isMatch = item.productDetail?.id === orderItem.productDetail?.id;
      if (orderItem.type) {
        isMatch = isMatch && item.type === orderItem.type;
      }
      if (orderItem.toppings?.length) {
        isMatch =
          isMatch &&
          JSON.stringify(item.toppings) === JSON.stringify(orderItem.toppings);
      }
      return isMatch;
    })
  );

  return (
    <div className="text-right">
      <Button
        loading={isBuyAgainLoading}
        className="text-primary"
        disabled={isAllItemsInCart || selectedOrder?.status !== "COMPLETED"}
        onClick={() => {
          if (selectedOrder) {
            const cartItemsToAdd = selectedOrder.orderItems.map((item) => ({
              productDetailId: item.productDetail.id,
              quantity: item.quantity,
              toppings: item.toppings || [],
              type: item.type,
            }));
            console.log(cartItemsToAdd);
            
            dispatch(
              buyAgainOrderAction({ orderItems: selectedOrder.orderItems })
            );
          }
        }}
      >
        {isAllItemsInCart
          ? "Tất cả sản phẩm đã có trong giỏ hàng"
          : "Mua lại đơn hàng"}
      </Button>
      <div className="flex justify-end items-center gap-8">
        <div className="text-right text-gray-500">
          <div className="mb-2">Tạm tính</div>
          <div className="mb-2">Phí vận chuyển</div>
          <div className="mb-2">Khuyến mãi vận chuyển</div>
          <div className="mb-2">Giảm giá</div>
          <div className="font-bold">Tổng cộng</div>
        </div>
        <div className="text-right">
          <div className="mb-2">{currencyFormat(totalAmount)}</div>
          <div className="mb-2">{currencyFormat(shippingFee)}</div>
          <div className="mb-2">0 ₫</div>
          <div className="mb-2">0 ₫</div>
          <div className="text-2xl text-orange-600 font-bold">
            {currencyFormat(totalAmount + shippingFee)}
          </div>
        </div>
      </div>
    </div>
  );
}
