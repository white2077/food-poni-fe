import {combineReducers} from "@reduxjs/toolkit";
import userReducer from "@/redux/modules/user.ts";
import cartReducer from "@/redux/modules/cart.ts";
import productReducer from "@/redux/modules/product.ts";
import addressReducer from "@/redux/modules/address.ts";
import rateReducer from "@/redux/modules/rate.ts";
import orderReducer from "@/redux/modules/order.ts";
import fileUploadsReducer from "@/redux/modules/fileUploads.ts";
import searchPositionReducer from "@/redux/modules/searchPosition.ts";
import mainMenuReducer from "@/redux/modules/mainMenu.ts";
import notificationReducer from "@/redux/modules/notification.ts";
import authReducer from "@/redux/modules/auth.ts";

export const rootReducer = combineReducers({
    address: addressReducer,
    auth: authReducer,
    cart: cartReducer,
    fileUpload: fileUploadsReducer,
    order: orderReducer,
    mainMenu: mainMenuReducer,
    notification: notificationReducer,
    product: productReducer,
    rate: rateReducer,
    searchPosition: searchPositionReducer,
    user: userReducer,
});