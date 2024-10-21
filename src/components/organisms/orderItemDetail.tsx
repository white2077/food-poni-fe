import { RootState } from "@/redux/store";
import { OrderItem } from "@/type/types";
import { server } from "@/utils/server";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OrderItemActions } from "../molecules/orderItemActions";
import { createCartAction } from "@/redux/modules/cart";
import RateAdd from "./reateAdd";
import { useEffect } from "react";
import { setInitialRatedItems } from "@/redux/modules/rate";

type Props = {
  orderItem: OrderItem;
  orderStatus: string;
};

export function OrderItemDetail({ orderItem, orderStatus }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { page } = useSelector((state: RootState) => state.cart);
  const ratedOrderItems = useSelector((state: RootState) => state.rate.ratedOrderItems);

  useEffect(() => {
    if (orderItem.rate && !ratedOrderItems.includes(orderItem.id)) {
      dispatch(setInitialRatedItems([...ratedOrderItems, orderItem.id]));
    }
  }, [orderItem, ratedOrderItems, dispatch]);

  const handleCreateCart = () => {
    dispatch(createCartAction());
    navigate("/checkout");
  };

  const isInCart = page.content.some(
    (item) => item.productDetail.id === orderItem.productDetail.id
  );

  return (
    <div className="font-sans text-[17px] text-gray-600">
      <div className="flex gap-2">
        <img
          src={server + orderItem.productDetail.product.thumbnail}
          className="w-[70px] h-[70px] aspect-square object-cover rounded-lg"
          alt={orderItem.productDetail.product.name}
        />
        <div>
          <div>
            {orderItem.productDetail.product.name +
              " " +
              orderItem.productDetail.name}
          </div>
          <OrderItemActions
            orderDetailId={orderItem.id}
            orderStatus={orderStatus}
            isInCart={isInCart}
            createCartItem={handleCreateCart}
          />
          <RateAdd />
        </div>
      </div>
    </div>
  );
}
