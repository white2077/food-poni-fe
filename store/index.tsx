import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from './cart.reducer';
import userReducer from './user.reducer';
import productReducer from "./product.reducer";
import addressReducer from "./address.reducer";
import deliveryReducer from "./delivery.reducer";
import rateReducer from "./rate.reducer";
import fileUploadsReducer from "./fileUploads.reducer";
import orderReducer from "./order.reducer";

const rootReducer = combineReducers({
    cart: cartReducer,
    user: userReducer,
    productList: productReducer,
    address: addressReducer,
    delivery: deliveryReducer,
    rate: rateReducer,
    order: orderReducer,
    fileUpload: fileUploadsReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;