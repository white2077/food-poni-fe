import {ICartItem} from "./reducer";

export const INCREASE_QUANTITY = "INCREASE_QUANTITY";
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const GET_NUMBER_CART = "GET_NUMBER_CART";
export const ADD_CART = "ADD_CART";
export const UPDATE_CART = "UPDATE_CART";
export const DELETE_CART = "DELETE_CART";

export function GetNumberCart() {
    return {
        type: "GET_NUMBER_CART",
    };
}

export function AddCart(payload: ICartItem) {
    return {
        type: "ADD_CART",
        payload,
    };
}
export function UpdateCart(payload: ICartItem) {
    return {
        type: "UPDATE_CART",
        payload,
    };
}
export function DeleteCart(payload: ICartItem) {
    return {
        type: "DELETE_CART",
        payload,
    };
}

export function IncreaseQuantity(payload: ICartItem) {
    return {
        type: "INCREASE_QUANTITY",
        payload,
    };
}
export function DecreaseQuantity(payload: ICartItem) {
    return {
        type: "DECREASE_QUANTITY",
        payload,
    };
}