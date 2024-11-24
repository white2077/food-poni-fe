import { Page, Topping } from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common";
import {
  createTopping,
  getToppingsPage,
  updateTopping,
  deleteTopping,
} from "@/utils/api/topping";
import { createAction, createSlice } from "@reduxjs/toolkit";
import { addMessageSuccess } from "./message";
import { notification } from "antd";
import { call, fork, put, race, select, take } from "redux-saga/effects";
import { RootState } from "../store";
import { ToppingFormState } from "@/components/molecules/ToppingForm";

export type ToppingState = {
  readonly page: Page<Topping[]>;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isUpdateLoading: boolean;
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
  isCreateLoading: false,
  isUpdateLoading: false,
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
    ) => ({
      ...state,
      page: payload,
      isFetchLoading: false,
    }),
    fetchToppingsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForToppingCreate: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    createToppingSuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createToppingFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateLoadingForToppingUpdate: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateToppingSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateToppingFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateLoadingForToppingDelete: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    deleteToppingSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    deleteToppingFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
  },
});
export default ToppingSlide.reducer;

export const fetchToppingsAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchToppingsRequest`
);
export const createToppingAction = createAction<{
  topping: ToppingFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/createToppingRequest`);

export const updateToppingAction = createAction<{
  topping: ToppingFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/updateToppingRequest`);

export const deleteToppingAction = createAction<{
  tid: string;
}>(`${SLICE_NAME}/deleteToppingRequest`);

export const {
  updateFetchLoadingSuccess,
  fetchToppingsSuccess,
  fetchToppingsFailure,
  updateLoadingForToppingCreate,
  createToppingSuccess,
  createToppingFailure,
  updateLoadingForToppingUpdate,
  updateToppingSuccess,
  updateToppingFailure,
  updateLoadingForToppingDelete,
  deleteToppingSuccess,
  deleteToppingFailure,
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
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchToppingsFailure());
    }
  }
}

function* handleCreateTopping() {
  while (true) {
    const {
      startCreateTopping,
      startUpdateTopping,
    }: {
      startCreateTopping: ReturnType<typeof createToppingAction>;
      startUpdateTopping: ReturnType<typeof updateToppingAction>;
    } = yield race({
      startCreateTopping: take(createToppingAction),
      startUpdateTopping: take(updateToppingAction),
    });

    try {
      if (startCreateTopping) {
        yield put(updateLoadingForToppingCreate());
        yield call(createTopping, startCreateTopping.payload.topping);
        yield put(createToppingSuccess());
        startCreateTopping.payload.resetForm();
      }

      if (startUpdateTopping) {
        yield put(updateLoadingForToppingUpdate());
        yield call(updateTopping, startUpdateTopping.payload.topping);
        yield put(updateToppingSuccess());
        startUpdateTopping.payload.resetForm();
      }

      const { size }: ToppingState["page"] = yield select(
        (state: RootState) => state.topping.page
      );

      yield put(
        fetchToppingsAction({
          queryParams: {
            page: 0,
            pageSize: size,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(createToppingFailure());
    }
  }
}

function* handleDeleteTopping() {
  while (true) {
    const {
      payload: { tid },
    }: ReturnType<typeof deleteToppingAction> = yield take(deleteToppingAction);

    try {
      yield put(updateLoadingForToppingDelete());
      yield call(deleteTopping, tid);
      yield put(deleteToppingSuccess());

      const { number, size }: ToppingState["page"] = yield select(
        (state: RootState) => state.topping.page
      );

      yield put(
        fetchToppingsAction({
          queryParams: {
            page: number,
            pageSize: size,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(deleteToppingFailure());
    }
  }
}

export const toppingSagas = [
  fork(handleFetchToppings),
  fork(handleCreateTopping),
  fork(handleDeleteTopping),
];
