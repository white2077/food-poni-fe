import { createSlice, createAction } from "@reduxjs/toolkit";
import { Page, ProductCategory } from "@/type/types.ts";
import { call, fork, put, take, race, select } from "redux-saga/effects";
import {
  getProductCategoriesPage,
  createProductCategories,
  deleteProductCategories,
  updateProductCategories,
} from "@/utils/api/productCategory.ts";
import { addMessageSuccess } from "./message";
import { QueryParams } from "@/utils/api/common";
import { RootState } from "../store";
import { ProductCategoriesFormState } from "@/components/molecules/ProductCategoriesForm";

export type ProductCategoryState = {
  readonly page: Page<ProductCategory[]>;
  readonly isFetchLoading: boolean;
  readonly formData: ProductCategory[];
  readonly isFormLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isUpdateLoading: boolean;
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
  formData: [],
  isFormLoading: false,
  isCreateLoading: false,
  isUpdateLoading: false,
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
    fetchFormDataRequest: (state) => ({
      ...state,
      isFormLoading: true,
    }),
    fetchFormDataSuccess: (state, { payload }) => {
      state.formData = payload;
      state.isFormLoading = false;
    },
    fetchFormDataFailure: (state) => ({
      ...state,
      isFormLoading: false,
    }),
    updateLoadingForProductCategoryCreate: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    createProductCategorySuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createProductCategoryFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateLoadingForProductCategoryUpdate: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateProductCategorySuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateProductCategoryFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateLoadingForProductCategoryDelete: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    deleteProductCategorySuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    deleteProductCategoryFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
  },
});
export default productCategorySlide.reducer;

export const {
  fetchProductCategoriesRequest,
  fetchProductCategoriesSuccess,
  fetchProductCategoriesFailure,
  fetchFormDataRequest,
  fetchFormDataSuccess,
  fetchFormDataFailure,
  updateLoadingForProductCategoryCreate,
  createProductCategorySuccess,
  createProductCategoryFailure,
  updateLoadingForProductCategoryUpdate,
  updateProductCategorySuccess,
  updateProductCategoryFailure,
  updateLoadingForProductCategoryDelete,
  deleteProductCategorySuccess,
  deleteProductCategoryFailure,
} = productCategorySlide.actions;

export const fetchProductCategoriesAction = createAction<{
  queryParams?: QueryParams;
}>(`${SLICE_NAME}/fetchProductCategoriesRequest`);

export const fetchFormDataAction = createAction(`${SLICE_NAME}/fetchFormData`);

export const createProductCategoryAction = createAction<{
  productCategory: ProductCategoriesFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/createProductCategoryRequest`);

export const updateProductCategoryAction = createAction<{
  productCategory: ProductCategoriesFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/updateProductCategoryRequest`);

export const deleteProductCategoryAction = createAction<{
  pcid: string;
}>(`${SLICE_NAME}/deleteProductCategoryRequest`);

function* handleFetchProductCategories() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchProductCategoriesAction> = yield take(
      fetchProductCategoriesAction
    );
    try {
      yield put(fetchProductCategoriesRequest());
      const page: Page<ProductCategory[]> = yield call(
        getProductCategoriesPage,
        queryParams
      );
      yield put(fetchProductCategoriesSuccess(page));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchProductCategoriesFailure());
    }
  }
}

function* handleFetchFormData() {
  while (true) {
    yield take(fetchFormDataAction);
    try {
      yield put(fetchFormDataRequest());
      const response: Page<ProductCategory[]> = yield call(
        getProductCategoriesPage
      );
      yield put(fetchFormDataSuccess(response.content));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchFormDataFailure());
    }
  }
}

function* handleCreateProductCategory() {
  while (true) {
    const {
      startCreateProductCategory,
      startUpdateProductCategory,
    }: {
      startCreateProductCategory: ReturnType<
        typeof createProductCategoryAction
      >;
      startUpdateProductCategory: ReturnType<
        typeof updateProductCategoryAction
      >;
    } = yield race({
      startCreateProductCategory: take(createProductCategoryAction),
      startUpdateProductCategory: take(updateProductCategoryAction),
    });

    try {
      if (startCreateProductCategory) {
        yield put(updateLoadingForProductCategoryCreate());
        yield call(
          createProductCategories,
          startCreateProductCategory.payload.productCategory
        );
        yield put(createProductCategorySuccess());
        startCreateProductCategory.payload.resetForm();
      }

      if (startUpdateProductCategory) {
        yield put(updateLoadingForProductCategoryUpdate());
        yield call(
          updateProductCategories,
          startUpdateProductCategory.payload.productCategory
        );
        yield put(updateProductCategorySuccess());
        startUpdateProductCategory.payload.resetForm();
      }

      const { size }: ProductCategoryState["page"] = yield select(
        (state: RootState) => state.productCategory.page
      );

      yield put(
        fetchProductCategoriesAction({
          queryParams: {
            page: 0,
            pageSize: size,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createProductCategoryFailure());
    }
  }
}

function* handleDeleteProductCategory() {
  while (true) {
    const {
      payload: { pcid },
    }: ReturnType<typeof deleteProductCategoryAction> = yield take(
      deleteProductCategoryAction
    );

    try {
      yield put(updateLoadingForProductCategoryDelete());
      yield call(deleteProductCategories, pcid);
      yield put(deleteProductCategorySuccess());

      const { number, size }: ProductCategoryState["page"] = yield select(
        (state: RootState) => state.productCategory.page
      );

      yield put(
        fetchProductCategoriesAction({
          queryParams: {
            page: number,
            pageSize: size,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(deleteProductCategoryFailure());
    }
  }
}

export const productCategorySagas = [
  fork(handleFetchProductCategories),
  fork(handleFetchFormData),
  fork(handleCreateProductCategory),
  fork(handleDeleteProductCategory),
];
