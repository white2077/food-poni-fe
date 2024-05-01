import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from './cart.reducer';
import productReducer from "./product.reducer";
import addressReducer from "./address.reducer";
import deliveryReducer from "./delivery.reducer";
import userReducer from "./user.reducer";
import orderReducer from "./order.reducer";
import fileUploadsReducer from "./fileUploads.reducer";
import searchPositionReducer from "./search-position.reducer";
import rateReducer from "./rate.reducer";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    productList: productReducer,
    address: addressReducer,
    delivery: deliveryReducer,
    rate: rateReducer,
    order: orderReducer,
    fileUpload: fileUploadsReducer,
    searchPosition: searchPositionReducer
});

const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;