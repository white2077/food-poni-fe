import { Page, Topping } from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common";
import { getToppingsPage } from "@/utils/api/topping";
import { createAction, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import { call, fork, put, take } from "redux-saga/effects";

export type ToppingState = {
  readonly page: Page<Topping[]>;
  readonly isFetchLoading: boolean;
};

const initialState: ToppingState = {
  page: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
    empty: true,
  },
  isFetchLoading: false,
};

const SLICE_NAME = "Topping";

const ToppingSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchToppingsSuccess: (
      state,
      { payload }: { payload: Page<Topping[]> }
    ) => {
      state.page = payload;
      state.isFetchLoading = false;
    },
    fetchToppingsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
  },
});
export default ToppingSlide.reducer;

export const fetchToppingsAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchToppingsRequest`
);

export const {
  updateFetchLoadingSuccess,
  fetchToppingsSuccess,
  fetchToppingsFailure,
} = ToppingSlide.actions;

function* handleFetchToppings() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchToppingsAction> = yield take(fetchToppingsAction);
    try {
      yield put(updateFetchLoadingSuccess());
      const page: Page<Topping[]> = yield call(getToppingsPage, queryParams);
      yield put(fetchToppingsSuccess(page));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchToppingsFailure());
    }
  }
}
export const toppingSagas = [fork(handleFetchToppings)];
