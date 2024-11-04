import { RootState } from "@/redux/store";
import { OrderItem } from "@/type/types";
import { server } from "@/utils/server";
import { useDispatch, useSelector } from "react-redux";
import { OrderItemActions } from "../molecules/OrderItemActions";
import RateAdd from "./RateAdd";
import { useEffect } from "react";
import { setInitialRatedItems } from "@/redux/modules/rate";
import { currencyFormat } from "@/utils/common.ts";

type Props = {
  orderItem: OrderItem;
  orderStatus: string;
};

export function OrderItemDetail({ orderItem, orderStatus }: Props) {
  const dispatch = useDispatch();

  const { page } = useSelector((state: RootState) => state.cart);
  const ratedOrderItems = useSelector(
    (state: RootState) => state.rate.ratedOrderItems
  );

  useEffect(() => {
    if (orderItem.rate && !ratedOrderItems.includes(orderItem.id)) {
      dispatch(setInitialRatedItems([...ratedOrderItems, orderItem.id]));
    }
  }, [orderItem, ratedOrderItems, dispatch]);

  const isInCart = page.content.some((item) => {
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
  });

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
            {orderItem.type && (
              <div className="text-[10px]">
                Loại:{" "}
                <span className="bg-primary text-white rounded-lg mr-1 px-1">
                  {orderItem.type}
                </span>
              </div>
            )}
            {orderItem.toppings && orderItem.toppings.length > 0 && (
              <div className="text-[10px]">
                <div>Topping:</div>
                {orderItem.toppings.map((tp, index) => {
                  return (
                    <div
                      key={index}
                      className="inline-block bg-primary text-white rounded-lg mr-1 px-1 mb-1"
                    >{`${tp.name}: ${currencyFormat(tp.price)}`}</div>
                  );
                })}
              </div>
            )}
          </div>
          <OrderItemActions
            orderItem={orderItem}
            orderStatus={orderStatus}
            isInCart={isInCart}
          />
          <RateAdd />
        </div>
      </div>
    </div>
  );
}
