import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {NotificationAPIResponse} from "../models/notification/NotificationResponseAPI";

export interface Notification {
    data: NotificationAPIResponse[],
    isLoading: boolean
}

const initialState: Notification = {
    data: [],
    isLoading: true
};

export const notificationsSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<NotificationAPIResponse[]>) => {
            state.data = action.payload;
            state.isLoading = false;
            return state;
        },
        addNotification: (state, action: PayloadAction<NotificationAPIResponse>) => {
            state.data.push(action.payload);
            return state;
        }
    },
});

export const {addNotification, setNotifications} = notificationsSlice.actions;
export default notificationsSlice.reducer;
