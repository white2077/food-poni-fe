import {createSlice} from "@reduxjs/toolkit";

export interface CurrentUser {
    id: string;
    sub: string;
    role: string;
    avatar: string;
    addressId: string;
    username: string;
    email: string;
}

export interface ICurrentUserState {
    currentUser: CurrentUser;
}

const initialState: ICurrentUserState = {
    currentUser: {} as CurrentUser
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
        }),
        updateAvatar: (state, {payload}: {payload: string}) => ({
            ...state,
            currentUser: {
                ...state.currentUser,
                avatar: payload
            }
        })
    }
});

export const {setCurrentUser, updateAddressId, updateAvatar} = userSlide.actions;
export default userSlide.reducer;
