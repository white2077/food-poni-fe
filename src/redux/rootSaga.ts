import { shippingAddressSagas } from "@/redux/modules/address.ts";
import { authSagas } from "@/redux/modules/auth.ts";
import { cartSagas } from "@/redux/modules/cart.ts";
import { cartGroupSagas } from "@/redux/modules/cartGroup.ts";
import { notificationSagas } from "@/redux/modules/notification.ts";
import { productSagas } from "@/redux/modules/product.ts";
import { productCategorySagas } from "@/redux/modules/productCategory.ts";
import { toppingSagas } from "@/redux/modules/topping.ts";
import { all } from "redux-saga/effects";
import { fileUploadsSagas } from "./modules/fileUploads.ts";
import { orderSagas } from "./modules/order";
import { rateSagas } from "./modules/rate.ts";
import { orderItemSagas } from "./modules/orderItem.ts";
import { productDetailSagas } from "./modules/productDetail.ts";
import { invoiceSagas } from "./modules/invoice.ts";
import { statisticSagas } from "./modules/statistic.ts";

export default function* rootSaga() {
  yield all([
    ...authSagas,
    ...cartSagas,
    ...fileUploadsSagas,
    ...invoiceSagas,
    ...notificationSagas,
    ...productSagas,
    ...productDetailSagas,
    ...productCategorySagas,
    ...cartGroupSagas,
    ...orderSagas,
    ...orderItemSagas,
    ...shippingAddressSagas,
    ...statisticSagas,
    ...toppingSagas,
    ...rateSagas,
  ]);
}
