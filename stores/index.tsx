import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from './cart.reducer';
import productReducer from "./product.reducer";
import addressReducer from "./address.reducer";
import userReducer from "./user.reducer";
import orderReducer from "./order.reducer";
import fileUploadsReducer from "./fileUploads.reducer";
import searchPositionReducer from "./search-position.reducer";
import rateReducer from "./rate.reducer";
import productCategoryReducer from "./product-category.reducer";
import notificationReducer from "./notification.reducer";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    productList: productReducer,
    address: addressReducer,
    rate: rateReducer,
    order: orderReducer,
    fileUpload: fileUploadsReducer,
    searchPosition: searchPositionReducer,
    productCategory: productCategoryReducer,
    notification: notificationReducer
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;