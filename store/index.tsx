import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from './cart/reducer'
const rootReducer = combineReducers({
    cart: cartReducer,
})


const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;