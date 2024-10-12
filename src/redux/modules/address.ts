import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Page, SearchResult} from "@/type/types.ts";
import {
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take,
} from "redux-saga/effects";
import { notification } from "antd";
import { QueryParams } from "@/utils/api/common.ts";
import {
  createAddress,
  deleteAddressById,
  getAddressesPage,
  searchAddresses,
} from "@/utils/api/address.ts";
import { updateShippingAddressAction } from "@/redux/modules/order.ts";
import { RootState } from "@/redux/store.ts";
import { Task } from "redux-saga";

export type AddressState = {
  readonly page: Page<
    Array<{
      readonly id: string;
      readonly fullName: string;
      readonly phoneNumber: string;
      readonly address: string;
      readonly lon: number;
      readonly lat: number;
      readonly isDeleteLoading: boolean;
    }>
  >;
  readonly form: {
    readonly fields: Array<{
      readonly field: string;
      readonly value: string;
      readonly errorMessage: string | null;
    }>;
    readonly isDirty: boolean;
  };
  readonly addressesSearched: Array<SearchResult>;
  readonly isShowAddForm: boolean;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
};

const initialState: AddressState = {
  page: {
    content: [
      {
        id: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        lon: 0,
        lat: 0,
        isDeleteLoading: false,
      },
    ],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
    empty: true,
  },
  form: {
    fields: [
      {
        field: "fullName",
        value: "",
        errorMessage: null,
      },
      {
        field: "phoneNumber",
        value: "",
        errorMessage: null,
      },
      {
        field: "address",
        value: "",
        errorMessage: null,
      },
      {
        field: "lon",
        value: "",
        errorMessage: null,
      },
      {
        field: "lat",
        value: "",
        errorMessage: null,
      },
    ],
    isDirty: true,
  },
  addressesSearched: [],
  isShowAddForm: false,
  isFetchLoading: false,
  isCreateLoading: false,
};

const SLICE_NAME = "address";

const addressSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    fetchAddressesSuccess: (
      state,
      action: PayloadAction<{
        page: Page<
          {
            readonly id: string;
            readonly fullName: string;
            readonly phoneNumber: string;
            readonly address: string;
            readonly lon: number;
            readonly lat: number;
            readonly isDeleteLoading: boolean;
          }[]
        >;
      }>,
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: action.payload.page.content.map((it) => {
          return {
            ...it,
          };
        }),
      },
      isFetchLoading: false,
    }),
    fetchAddressesFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    createAddressSuccess: (
      state,
      action: PayloadAction<{
        readonly id: string;
        readonly fullName: string;
        readonly phoneNumber: string;
        readonly address: string;
        readonly lon: number;
        readonly lat: number;
        readonly isDeleteLoading: boolean;
      }>,
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: [
          ...state.page.content,
          {
            id: action.payload.id,
            address: action.payload.address,
            lat: action.payload.lat,
            lon: action.payload.lon,
            fullName: action.payload.fullName,
            phoneNumber: action.payload.phoneNumber,
            isDeleteLoading: action.payload.isDeleteLoading,
          },
        ],
      },
      isCreateLoading: false,
    }),
    createAddressFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    deleteAddressSuccess: (state, action: PayloadAction<{ aid: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content
          .map((it) => {
            if (it.id === action.payload.aid) {
              return {
                ...it,
                isDeleteLoading: true,
              };
            }
            return it;
          })
          .filter((it) => it.id !== action.payload.aid),
        totalElements: state.page.totalElements - 1,
      },
    }),
    deleteAddressFailure: (state, action: PayloadAction<{ aid: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.aid) {
            return {
              ...it,
              isDeleteLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    updateFormSuccess: (
      state,
      action: PayloadAction<{
        type: "TYPING" | "SELECT";
        field: string;
        value: string;
      }>,
    ) => {
      let errorMessage;
      if (action.payload.type === "TYPING") {
        switch (action.payload.field) {
          case "fullName":
            if (action.payload.value === "") {
              errorMessage = "Tên người nhận không được để trống";
              break;
            }
            if (action.payload.value.length < 5) {
              errorMessage = "Tên người nhận phải có ít nhất 5 ký tự";
              break;
            }
            break;
          case "phoneNumber":
            if (action.payload.value === "") {
              errorMessage = "Số điện thoại không được để trống";
              break;
            }
            if (isNaN(parseInt(action.payload.value))) {
              errorMessage = "Số điện thoại phải là số";
              break;
            }
            if (action.payload.value.length < 10) {
              errorMessage = "Số điện thoại phải có ít nhất 10 ký tự";
              break;
            }
            break;
          case "address":
            if (action.payload.value === "") {
              errorMessage = "Địa chỉ không được để trống";
              break;
            }
            if (action.payload.value) {
              errorMessage = "Vui lòng chọn một địa chỉ";
              break;
            }
            break;
        }
      }
      if (action.payload.type === "SELECT") {
        switch (action.payload.field) {
          case "address":
            if (action.payload.value) {
              errorMessage = null;
              break;
            }
        }
      }
      if (errorMessage) {
        return {
          ...state,
          form: {
            ...state.form,
            fields: state.form.fields.map((it) => {
              if (it.field === action.payload.field) {
                return {
                  ...it,
                  value: action.payload.value,
                  errorMessage,
                };
              }
              return it;
            }),
            isDirty: true,
          },
        };
      } else {
        return {
          ...state,
          form: {
            ...state.form,
            fields: state.form.fields.map((it) => {
              if (it.field === action.payload.field) {
                return {
                  ...it,
                  value: action.payload.value,
                  errorMessage: null,
                };
              }
              return it;
            }),
            isDirty: state.form.fields.some((it) => it.errorMessage !== null),
          },
        };
      }
      return state;
    },
    updateAddressesSearchedSuccess: (state, action: PayloadAction<{ addresses: Array<SearchResult> }>) => ({
      ...state,
      addressesSearched: action.payload.addresses,
    }),
    clearFormSuccess: (state) => ({
      ...state,
      form: initialState.form,
    }),
    updateShowAddForm: (state) => ({
      ...state,
      isShowAddForm: !state.isShowAddForm,
    }),
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    updateCreateLoading: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
  },
});
export default addressSlide.reducer;

export const {
  fetchAddressesSuccess,
  fetchAddressesFailure,
  createAddressSuccess,
  createAddressFailure,
  deleteAddressSuccess,
  deleteAddressFailure,
  updateFormSuccess,
  updateAddressesSearchedSuccess,
  clearFormSuccess,
  updateShowAddForm,
  updateFetchLoading,
  updateCreateLoading,
} = addressSlide.actions;

export const fetchAddressesAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchAddressesRequest`,
);
export const createAddressAction = createAction<void>(
  `${SLICE_NAME}/createAddressRequest`,
);
export const deleteAddressAction = createAction<{
  aid: string;
}>(`${SLICE_NAME}/deleteAddressRequest`);
export const startSearchAddressAction = createAction<{
  value: string;
}>(`${SLICE_NAME}/startSearchAddressRequest`);

function* handleFetchAddress() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchAddressesAction> = yield take(
      fetchAddressesAction.type,
    );
    try {
      yield put(updateFetchLoading());
      const page: Page<
        {
          readonly id: string;
          readonly fullName: string;
          readonly phoneNumber: string;
          readonly address: string;
          readonly lon: number;
          readonly lat: number;
          readonly isDeleteLoading: boolean;
        }[]
      > = yield call(getAddressesPage, queryParams);
      yield put(fetchAddressesSuccess({ page }));
      const { currentUser } = yield select((state: RootState) => state.auth);
      if (currentUser) {
        yield put(updateShippingAddressAction(currentUser.addressId));
      }
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });
      yield put(fetchAddressesFailure());
    }
  }
}

function* handleCreateAddress() {
  while (true) {
    yield take(createAddressAction.type);
    try {
      yield put(updateCreateLoading());
      const fields: Array<{
        readonly field: string;
        readonly value: string;
        readonly errorMessage: string | null;
      }> = yield select((state: RootState) => state.address.form.fields);
      const {id}: { id: string } = yield call(createAddress, {
        fullName: fields[0].value,
        phoneNumber: fields[1].value,
        address: fields[2].value,
        lon: Number.parseInt(fields[3].value),
        lat: Number.parseInt(fields[4].value),
      });
      yield put(
        createAddressSuccess({
          id: id,
          fullName: fields[0].value,
          phoneNumber: fields[1].value,
          address: fields[2].value,
          lon: Number.parseInt(fields[3].value),
          lat: Number.parseInt(fields[4].value),
          isDeleteLoading: false,
        }),
      );
      yield put(clearFormSuccess());
      yield put(updateShowAddForm());
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(createAddressFailure());
    }
  }
}

function* handleDeleteAddress() {
  while (true) {
    const {
      payload: { aid },
    }: ReturnType<typeof deleteAddressAction> = yield take(
      deleteAddressAction.type,
    );
    try {
      yield call(deleteAddressById, aid);
      yield put(deleteAddressSuccess({ aid }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(deleteAddressFailure({ aid }));
    }
  }
}

function* handleStartSearchAddress() {
  let searchTask: Task | null = null;
  while (true) {
    const {
      payload: { value },
    }: ReturnType<typeof startSearchAddressAction> = yield take(
      startSearchAddressAction.type,
    );

    if (searchTask) {
      yield cancel(searchTask);
      searchTask = null;
    }

    searchTask = yield fork(searchAddress, value);
  }
}

function* searchAddress(value: string) {
  yield delay(500);
  const result: Array<SearchResult> = yield call(searchAddresses, value);
  yield put(updateAddressesSearchedSuccess({ addresses: result }));
}

export const shippingAddressSagas = [
  fork(handleFetchAddress),
  fork(handleCreateAddress),
  fork(handleDeleteAddress),
  fork(handleStartSearchAddress),
];
