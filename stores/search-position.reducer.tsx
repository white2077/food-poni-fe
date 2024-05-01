import {createSlice} from "@reduxjs/toolkit";

export interface SearchResult {
    display_name: string | null;
    lon: number;
    lat: number;
}

export interface ISearchPositionState {
    searchPosition: SearchResult | null;
}

const initialState: ISearchPositionState = {
    searchPosition: null
}

const searchPositionSlide = createSlice({
    name: 'searchPosition',
    initialState,
    reducers: {
        setSelectedAddress: (state, {payload}: { payload: SearchResult }) => {
            state.searchPosition = payload
        },
    }
});

export const {setSelectedAddress} = searchPositionSlide.actions;
export default searchPositionSlide.reducer;