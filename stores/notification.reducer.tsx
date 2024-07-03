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
        },
        markIsReadNotification: (state, action: PayloadAction<string>) => {
            let noti: NotificationAPIResponse = state.data.find((item: NotificationAPIResponse) => item.id === action.payload)!;
            noti.isRead = true;
            return state;
        }
    },
});

export const {addNotification, setNotifications, markIsReadNotification} = notificationsSlice.actions;
export default notificationsSlice.reducer;
