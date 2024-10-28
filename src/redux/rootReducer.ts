import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "@/redux/modules/cart.ts";
import productReducer from "@/redux/modules/product.ts";
import productCategoryReducer from "@/redux/modules/productCategory.ts";
import rateReducer from "@/redux/modules/rate.ts";
import orderReducer from "@/redux/modules/order.ts";
import cartGroupReducer from "@/redux/modules/cartGroup.ts";
import fileUploadsReducer from "@/redux/modules/fileUploads.ts";
import mainMenuReducer from "@/redux/modules/mainMenu.ts";
import notificationReducer from "@/redux/modules/notification.ts";
import authReducer from "@/redux/modules/auth.ts";
import addressReducer from "@/redux/modules/address.ts";

export const rootReducer = combineReducers({
  address: addressReducer,
  auth: authReducer,
  cart: cartReducer,
  fileUpload: fileUploadsReducer,
  order: orderReducer,
  cartGroup: cartGroupReducer,
  mainMenu: mainMenuReducer,
  notification: notificationReducer,
  product: productReducer,
  productCategory: productCategoryReducer,
  rate: rateReducer,
});
