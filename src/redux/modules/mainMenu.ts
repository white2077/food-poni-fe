import { createSlice } from "@reduxjs/toolkit";

export interface IMainMenuState {
  currentMainMenu: string;
}

const initialState: IMainMenuState = {
  currentMainMenu: "all",
};

const SLICE_NAME = "mainMenu";

const mainMenuSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setSelectedMainMenu: (state, { payload }: { payload: string }) => {
      state.currentMainMenu = payload;
    },
  },
});

export const { setSelectedMainMenu } = mainMenuSlide.actions;
export default mainMenuSlide.reducer;
