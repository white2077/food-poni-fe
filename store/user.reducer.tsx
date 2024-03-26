import {createSlice} from "@reduxjs/toolkit";

export interface ICurrentUser {
    id: string;
    avatar: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface ICurrentUserState {
    currentUser: ICurrentUser;
}

const initialState: ICurrentUserState = {
    currentUser: {
        id: '',
        avatar: '',
        username: '',
        email: '',
        firstName: '',
        lastName: ''
    },
}

const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => ({
            ...state,
            currentUser: action.payload
        })
    }
});

export const {setCurrentUser} = userSlide.actions;
export default userSlide.reducer;