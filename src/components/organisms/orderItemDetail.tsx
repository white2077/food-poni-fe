import { createCartAction } from "@/redux/modules/cart";
import { RootState } from "@/redux/store";
import { OrderItem } from "@/type/types";
import { server } from "@/utils/server";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OrderItemActions } from "../molecules/orderItemActions";
import RateAdd from "./reateAdd";

type Props = {
  orderItem: OrderItem;
  orderStatus: string;
};

export function OrderItemDetail({ orderItem, orderStatus }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { page } = useSelector((state: RootState) => state.cart);

  return (
    <div className="font-sans text-[17px] text-gray-600">
      <div className="flex gap-2">
        <img
          src={server + orderItem.productDetail.product.thumbnail}
          className="w-[70px] h-[70px] aspect-square object-cover rounded-lg"
        />
        <div>
          <div>
            <div>
              {orderItem.productDetail.product.name +
                " " +
                orderItem.productDetail.name}
            </div>
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
                        >{`${tp.name}: ${tp.price}₫`}</div>
                    );
                  })}
                </div>
            )}
          </div>
          <OrderItemActions
            orderDetailId={orderItem.id}
            orderStatus={orderStatus}
            isInCart={page.content.some(
              (it) => it.productDetail && it.productDetail.id === orderItem.productDetail.id
            )}
            createCartItem={() => {
              dispatch(
                createCartAction()
              );
              navigate("/checkout");
            }}
          />
          <RateAdd/>
        </div>
      </div>
    </div>
  );
}
