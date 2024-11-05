import addressReducer from "@/redux/modules/address.ts";
import authReducer from "@/redux/modules/auth.ts";
import cartReducer from "@/redux/modules/cart.ts";
import cartGroupReducer from "@/redux/modules/cartGroup.ts";
import fileUploadsReducer from "@/redux/modules/fileUploads.ts";
import mainMenuReducer from "@/redux/modules/mainMenu.ts";
import notificationReducer from "@/redux/modules/notification.ts";
import orderReducer from "@/redux/modules/order.ts";
import orderItemReducer from "@/redux/modules/orderItem.ts";
import productReducer from "@/redux/modules/product.ts";
import productCategoryReducer from "@/redux/modules/productCategory.ts";
import rateReducer from "@/redux/modules/rate.ts";
import toppingReducer from "@/redux/modules/topping.ts";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  address: addressReducer,
  auth: authReducer,
  cart: cartReducer,
  fileUpload: fileUploadsReducer,
  order: orderReducer,
  orderItem: orderItemReducer,
  cartGroup: cartGroupReducer,
  mainMenu: mainMenuReducer,
  notification: notificationReducer,
  product: productReducer,
  productCategory: productCategoryReducer,
  rate: rateReducer,
  topping: toppingReducer,
});
