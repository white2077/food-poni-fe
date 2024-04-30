import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from './cart.reducer';
import productReducer from "./product.reducer";
import addressReducer from "./address.reducer";
import deliveryReducer from "./delivery.reducer";
import userReducer from "./user.reducer";
import searchPositionReducer from "./search-position.reducer";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    productList: productReducer,
    address: addressReducer,
    delivery: deliveryReducer,
    searchPosition: searchPositionReducer
});

const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;