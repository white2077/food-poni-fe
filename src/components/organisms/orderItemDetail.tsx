import { createCartRequest } from "@/redux/modules/cart";
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
            {orderItem.productDetail.product.name +
              " " +
              orderItem.productDetail.name}
          </div>
          <OrderItemActions
            orderDetailId={orderItem.id}
            orderStatus={orderStatus}
            isInCart={page.content.some(
              (it) => it.productDetail.id === orderItem.productDetail.id
            )}
            createCartItem={() => {
              dispatch(
                createCartRequest({
                  quantity: orderItem.quantity,
                  productDetail: orderItem.productDetail.id,
                  productName: orderItem.productDetail.product.name,
                  productDetailName: orderItem.productDetail.name,
                  price: orderItem.price,
                  thumbnail: orderItem.productDetail.product.thumbnail,
                })
              );
              navigate("/checkout");
            }}
          />
          <RateAdd></RateAdd>
        </div>
      </div>
    </div>
  );
}
