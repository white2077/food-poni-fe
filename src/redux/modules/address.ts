import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Page, SearchResult } from "@/type/types.ts";
import {
  call,
  cancel,
  delay,
  fork,
  put,
  race,
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
  updateAddress,
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
  readonly formSaved: {
    readonly fields: Array<{
      readonly field: string;
      readonly value: string;
    }> | null;
  };
  readonly formEditing: {
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
  formSaved: {
    fields: null,
  },
  formEditing: {
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
      {
        field: "username",
        value: "",
        errorMessage: null,
      },
      {
        field: "email",
        value: "",
        errorMessage: null,
      },
      {
        field: "password",
        value: "",
        errorMessage: null,
      },
    ],
    isDirty: false,
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
    updateAddressSuccess: (
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
    ) => {
      const address = state.page.content.find(
        (it) => it.id === action.payload.id,
      );

      if (address) {
        return {
          ...state,
          page: {
            ...state.page,
            content: state.page.content.map((it) => {
              if (it.id === action.payload.id) {
                return {
                  ...it,
                  ...action.payload,
                };
              }
              return it;
            }),
          },
          isUpdateLoading: false,
        };
      }

      if (!address) {
        return {
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
          isUpdateLoading: false,
        };
      }

      return state;
    },
    createAddressFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
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
    updateFormSavedSuccess: (
      state,
      action: PayloadAction<{
        fields: Array<{ field: string; value: string }>;
      }>,
    ) => ({
      ...state,
      formSaved: {
        ...state.formSaved,
        fields: action.payload.fields,
      },
    }),
    updateFormEditingSuccess: (
      state,
      action: PayloadAction<{
        type?: "TYPING" | "SELECT";
        field: string;
        value: string;
      }>,
    ) => {
      let errorMessage: string | null = null;
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
            if (
              action.payload.value.startsWith("00") ||
              !action.payload.value.startsWith("0")
            ) {
              errorMessage = "Số điện thoại không hợp lệ";
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
          case "username":
            if (action.payload.value === "") {
              errorMessage = "Tên đăng nhập không được để trống";
            } else if (action.payload.value.length < 6 || action.payload.value.length > 50) {
              errorMessage = "Tên đăng nhập phải có từ 6 đến 50 ký tự";
            } else if (/\s/.test(action.payload.value)) {
              errorMessage = "Tên đăng nhập không được chứa dấu cách";
            }
            break;
          case "email":
            if (action.payload.value === "") {
              errorMessage = "Email không được để trống";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.payload.value)) {
              errorMessage = "Email không hợp lệ";
            }else if (/\s/.test(action.payload.value)) {
              errorMessage = "Email không được chứa dấu cách";
            }
            break;
          case "password":
            if (action.payload.value === "") {
              errorMessage = "Mật khẩu không được để trống";
            } else if (action.payload.value.length < 6 || action.payload.value.length > 50) {
              errorMessage = "Mật khẩu phải có từ 6 đến 50 ký tự";
            } else if (/\s/.test(action.payload.value)) {
              errorMessage = "Mật khẩu không được chứa dấu cách";
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

      const updatedFields = state.formEditing.fields.map((field) => {
        if (field.field === action.payload.field) {
          return {
            ...field,
            value: action.payload.value,
            errorMessage,
          };
        }
        return field;
      });

      const isDirty = updatedFields.some((field) => field.errorMessage !== null);

      return {
        ...state,
        formEditing: {
          fields: updatedFields,
          isDirty,
        },
      };
    },
    updateAddressesSearchedSuccess: (
      state,
      action: PayloadAction<{ addresses: Array<SearchResult> }>,
    ) => ({
      ...state,
      addressesSearched: action.payload.addresses,
    }),
    clearFormSuccess: (state) => ({
      ...state,
      formEditing: initialState.formEditing,
    }),
    updateShowAddForm: (state) => ({
      ...state,
      formSaved: initialState.formSaved,
      formEditing: initialState.formEditing,
      isShowAddForm: !state.isShowAddForm,
    }),
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    updateCreateLoading: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
  },
});
export default addressSlide.reducer;

export const {
  fetchAddressesSuccess,
  fetchAddressesFailure,
  updateAddressSuccess,
  createAddressFailure,
  deleteAddressSuccess,
  deleteAddressFailure,
  updateFormSavedSuccess,
  updateFormEditingSuccess,
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
export const updateAddressAction = createAction<{ id: string }>(
  `${SLICE_NAME}/updateAddressRequest`,
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
    }: ReturnType<typeof fetchAddressesAction> =
      yield take(fetchAddressesAction);
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
    const {
      startCreateAddress,
      startUpdateAddress,
    }: {
      startCreateAddress: ReturnType<typeof createAddressAction>;
      startUpdateAddress: ReturnType<typeof updateAddressAction>;
    } = yield race({
      startCreateAddress: take(createAddressAction),
      startUpdateAddress: take(updateAddressAction),
    });

    try {
      yield put(updateCreateLoading());
      const fields: Array<{
        readonly field: string;
        readonly value: string;
        readonly errorMessage: string | null;
      }> = yield select((state: RootState) => state.address.formEditing.fields);
      if (startCreateAddress) {
        const { id }: { id: string } = yield call(createAddress, {
          fullName: fields[0].value,
          phoneNumber: fields[1].value,
          address: fields[2].value,
          lon: Number.parseInt(fields[3].value),
          lat: Number.parseInt(fields[4].value),
        });
        yield put(
          updateAddressSuccess({
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
      }

      if (startUpdateAddress) {
        yield call(updateAddress, {
          id: startUpdateAddress.payload.id,
          fullName: fields[0].value,
          phoneNumber: fields[1].value,
          address: fields[2].value,
          lon: Number.parseInt(fields[3].value),
          lat: Number.parseInt(fields[4].value),
        });
        yield put(
          updateAddressSuccess({
            id: startUpdateAddress.payload.id,
            fullName: fields[0].value,
            phoneNumber: fields[1].value,
            address: fields[2].value,
            lon: Number.parseInt(fields[3].value),
            lat: Number.parseInt(fields[4].value),
            isDeleteLoading: false,
          }),
        );
      }
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
    }: ReturnType<typeof deleteAddressAction> = yield take(deleteAddressAction);
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
      startSearchAddressAction,
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