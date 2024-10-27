import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectOrderItemRate,
  setShowModalAddRate,
} from "@/redux/modules/rate";
import { OrderItem } from "@/type/types.ts";
import { buyBackCartAction } from "@/redux/modules/cart.ts";

type Props = {
  orderItem: OrderItem;
  orderStatus: string;
  isInCart: boolean;
};

export function OrderItemActions({ orderItem, orderStatus, isInCart }: Props) {
  const dispatch = useDispatch();
  const ratedOrderItems = useSelector(
    (state: RootState) => state.rate.ratedOrderItems,
  );
  const isRated = ratedOrderItems.includes(orderItem.id);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        className={`border border-primary text-primary ${
          orderStatus === "COMPLETED" && !isRated
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-30"
        }`}
        onClick={() => {
          dispatch(setSelectOrderItemRate(orderItem.id));
          dispatch(setShowModalAddRate(true));
        }}
        disabled={orderStatus !== "COMPLETED" || isRated}
      >
        {isRated ? "Đã đánh giá" : "Đánh giá"}
      </Button>

      <Button className="border border-primary text-primary">
        Xem đánh giá
      </Button>
      <Button
        onClick={() => {
          if (orderItem) {
            dispatch(buyBackCartAction({ orderItem }));
          }
          window.location.href = "/checkout";
        }}
        className={`border border-primary text-primary ${
          isInCart
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        }`}
        disabled={orderStatus !== "COMPLETED" && isInCart}
      >
        {isInCart ? "Đã có trong giỏ hàng" : "Mua lại"}
      </Button>
    </div>
  );
}
