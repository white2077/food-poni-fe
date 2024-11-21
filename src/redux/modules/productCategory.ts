import { createSlice } from "@reduxjs/toolkit";
import { Page, ProductCategory } from "@/type/types.ts";
import { call, fork, put, take } from "redux-saga/effects";
import { getProductCategoriesPage } from "@/utils/api/productCategory.ts";
import { addMessageSuccess } from "./message";

export type ProductCategoryState = {
  readonly page: Page<ProductCategory[]>;
  readonly isFetchLoading: boolean;
};

const initialState: ProductCategoryState = {
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

const SLICE_NAME = "productCategory";

const productCategorySlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    fetchProductCategoriesRequest: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchProductCategoriesSuccess: (
      state,
      { payload }: { payload: Page<ProductCategory[]> }
    ) => {
      state.page = payload;
      state.isFetchLoading = false;
    },
    fetchProductCategoriesFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
  },
});
export default productCategorySlide.reducer;

export const {
  fetchProductCategoriesRequest,
  fetchProductCategoriesSuccess,
  fetchProductCategoriesFailure,
} = productCategorySlide.actions;

function* handleFetchProductCategories() {
  while (true) {
    yield take(fetchProductCategoriesRequest);
    try {
      const page: Page<ProductCategory[]> = yield call(
        getProductCategoriesPage,
        {}
      );
      yield put(fetchProductCategoriesSuccess(page));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchProductCategoriesFailure());
    }
  }
}
export const productCategorySagas = [fork(handleFetchProductCategories)];
