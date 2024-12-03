import {
  deleteAllCartRequest,
  updateAllCheckedRequest,
} from "@/redux/modules/cart.ts";
import { RootState } from "@/redux/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { CartBody } from "../molecules/CartBody.tsx";
import { CartHeader } from "../molecules/CartHeader.tsx";

export const CartItems = () => {
  const dispatch = useDispatch();

  const {
    page,
    isFetchLoading,
    isAllChecked,
    isDeleteAllLoading,
    isCheckAllLoading,
  } = useSelector((state: RootState) => state.cart);

  return (
    <div className="w-full">
      <CartHeader
        enableCartGroup={false}
        enableDeleteAll={page.content.length > 0}
        isAllChecked={isAllChecked}
        isDeleteAllLoading={isDeleteAllLoading}
        isCheckAllLoading={isCheckAllLoading}
        isDisableCheckbox={page.content.length < 1}
        updateAllCheckedRequest={() => dispatch(updateAllCheckedRequest())}
        deleteAllCartRequest={() => dispatch(deleteAllCartRequest())}
      />
      <CartBody
        isFetchLoading={isFetchLoading}
        enableCartGroup={false}
        carts={page.content}
      />
    </div>
  );
};
