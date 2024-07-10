import {createSlice} from "@reduxjs/toolkit";

export interface CurrentUser {
    id?: string;
    sub?: string;
    role?: string;
    avatar?: string;
    addressId?: string;
    username?: string;
    email?: string;
}

export interface ICurrentUserState {
    currentUser: CurrentUser;
}

const initialState: ICurrentUserState = {
    currentUser: {}
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
