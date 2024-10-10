import { formatCurrency } from "@/utils/currencyUtils";

type Props = {
  price: number;
  quantity: number;
};

export function OrderItemPricing({ price, quantity }: Props) {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-600">
          {formatCurrency(price)}
        </div>
      </div>
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-600">{quantity}</div>
      </div>
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-600">0</div>
      </div>
      <div className="col-span-2 text-right">
        <div className="font-sans text-[17px] text-gray-600 text-right">
          {formatCurrency(price * quantity)}
        </div>
      </div>
    </div>
  );
}
