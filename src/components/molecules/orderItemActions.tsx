import { Button } from "antd";

type Props = {
  orderDetailId: string;
  orderStatus: string;
  isInCart: boolean;
  createCartItem: () => void;
};

export function OrderItemActions({
  orderStatus,
  isInCart,
  createCartItem,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        className={`border border-primary text-primary ${
          orderStatus === "COMPLETED"
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-30"
        }`}
        onClick={() => {}}
      >
        Đánh giá
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
