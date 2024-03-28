import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CurrentUser} from "../model/User";

export const INITIAL_CURRENT_USER = {
    id: "",
    sub: "",
    roles: [],
    firstName: "",
    lastName: "",
    avatar: "",
    email: "",
    phoneNumber: "",
    username: "",
    accessToken: ""
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
        })
    }
});

export const {setCurrentUser} = userSlide.actions;
export default userSlide.reducer;