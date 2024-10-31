import { currencyFormat, formatCurrency } from "@/utils/common.ts";
import { OrderItem } from "@/type/types.ts";

export function OrderItemPricing({ orderItem }: { orderItem: OrderItem }) {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-600">
          {formatCurrency(orderItem.price)}
        </div>
      </div>
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-600">
          {orderItem.quantity}
        </div>
      </div>
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-600">0</div>
      </div>
      <div className="col-span-2 text-right">
        <div className="font-sans text-[17px] text-gray-600 text-right">
          {orderItem.toppings && orderItem.toppings.length > 0
            ? currencyFormat(
                (orderItem.price +
                  orderItem.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
                  orderItem.quantity,
              )
            : currencyFormat(orderItem.price * orderItem.quantity)}
        </div>
      </div>
    </div>
  );
}
