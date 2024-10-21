import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setShowModalAddRate,
  setSelectOrderItemRate,
} from "@/redux/modules/rate";

type Props = {
  orderDetailId: string;
  orderStatus: string;
  isInCart: boolean;
  createCartItem: () => void;
};

export function OrderItemActions({
  orderDetailId,
  orderStatus,
  isInCart,
  createCartItem,
}: Props) {
  const dispatch = useDispatch();
  const ratedOrderItems = useSelector((state: RootState) => state.rate.ratedOrderItems);
  const isRated = ratedOrderItems.includes(orderDetailId);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        className={`border border-primary text-primary ${
          orderStatus === "COMPLETED" && !isRated
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-30"
        }`}
        onClick={() => {
          dispatch(setSelectOrderItemRate(orderDetailId));
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
        onClick={() => createCartItem()}
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
