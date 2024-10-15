import { all } from "redux-saga/effects";
import { authSagas } from "@/redux/modules/auth.ts";
import { productSagas } from "@/redux/modules/product.ts";
import { cartSagas } from "@/redux/modules/cart.ts";
import { productCategorySagas } from "@/redux/modules/productCategory.ts";
import { orderSagas } from "./modules/order";
import { shippingAddressSagas } from "@/redux/modules/address.ts";
import { notificationSagas } from "@/redux/modules/notification.ts";
import { rateSagas } from "./modules/rate";
import { fileUploadsSagas } from "./modules/fileUploads";

export default function* rootSaga() {
  yield all([
    ...authSagas,
    ...cartSagas,
    ...notificationSagas,
    ...productSagas,
    ...productCategorySagas,
    ...orderSagas,
    ...shippingAddressSagas,
    ...rateSagas,
    ...fileUploadsSagas
  ]);
}
