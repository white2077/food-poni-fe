import {createSlice} from "@reduxjs/toolkit";
import {CurrentUser} from "../model/User";

export const INITIAL_CURRENT_USER: CurrentUser = {
    id: "",
    sub: "",
    roles: [],
    firstName: "",
    lastName: "",
    avatar: "",
    email: "",
    phoneNumber: "",
    username: "",
    accessToken: "",
    addressId: ""
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