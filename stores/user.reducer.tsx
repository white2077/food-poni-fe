import {createSlice} from "@reduxjs/toolkit";
import {INITIAL_ADDRESS_API_RESPONSE} from "../models/address/AddressAPIResponse";
import {UserAPIResponse} from "../models/user/UserResponseAPI";

export interface CurrentUser {
    id: string;
    sub: string;
    role: string;
    avatar: string;
    addressId: string;
    username: string;
    email: string;
}

export const INITIAL_CURRENT_USER: CurrentUser = {
    id: "",
    sub: "",
    role: "",
    avatar: "",
    addressId: "",
    username: "",
    email: ""
}

export interface ICurrentUserState {
    currentUser: CurrentUser;
}

const initialState: ICurrentUserState = {
    currentUser: INITIAL_CURRENT_USER
}

const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, {payload}: {payload: CurrentUser}) => ({
            ...state,
            currentUser: payload
        }),
        updateAddressId: (state, {payload}: {payload: string}) => ({
            ...state,
            currentUser: {
                ...state.currentUser,
                addressId: payload
            }
        })
    }
});

export const {setCurrentUser, updateAddressId} = userSlide.actions;
export default userSlide.reducer;
