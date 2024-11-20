import { Invoice, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import {
  createPostPaidOrders,
  getConsolidatedInvoices,
} from "@/utils/api/invoice";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, race, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type InvoiceState = {
  readonly page: Page<Array<Invoice & { readonly isPaymentLoading: boolean }>>;
  readonly selectedInvoice: Invoice | null;
  readonly isFetchLoading: boolean;
};

const initialState: InvoiceState = {
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
  selectedInvoice: null,
  isFetchLoading: false,
};

const SLICE_NAME = "invoice";

const invoiceSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    fetchInvoicesSuccess: (
      state,
      action: PayloadAction<{ page: InvoiceState["page"] }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchInvoicesFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    updateCreateLoading: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    createPostPaidOrdersSuccess: (
      state,
      action: PayloadAction<{ ppid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((invoice) => {
          if (invoice.id === action.payload.ppid) {
            return {
              ...invoice,
              isPaymentLoading: false,
              payment: {
                ...invoice.payment,
              },
            };
          }
          return invoice;
        }),
      },
    }),
    createPostPaidOrdersFailure: (
      state,
      action: PayloadAction<{ ppid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((invoice) => {
          if (invoice.id === action.payload.ppid) {
            return {
              ...invoice,
              isPaymentLoading: false,
            };
          }
          return invoice;
        }),
      },
    }),
    updateLoadingForPayment: (
      state,
      action: PayloadAction<{ ppid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((invoice) => {
          if (invoice.id === action.payload.ppid) {
            return {
              ...invoice,
              isPaymentLoading: true,
            };
          }
          return invoice;
        }),
      },
    }),
  },
});

export default invoiceSlice.reducer;

export const {
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  updateFetchLoading,
  updateCreateLoading,
  createPostPaidOrdersSuccess,
  createPostPaidOrdersFailure,
  updateLoadingForPayment,
} = invoiceSlice.actions;
export const fetchConsolidatedInvoiceAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchConsolidatedInvoiceRequest`);
export const createPostPaidOrdersAction = createAction<{
  ppid: string;
  onSuccess?: (paymentUrl: string) => void;
}>(`${SLICE_NAME}/createPostPaidOrdersRequest`);

function* handleFetchInvoices() {
  while (true) {
    const {
      fetchConsolidatedInvoice,
    }: {
      fetchConsolidatedInvoice: ReturnType<
        typeof fetchConsolidatedInvoiceAction
      >;
    } = yield race({
      fetchConsolidatedInvoice: take(fetchConsolidatedInvoiceAction),
    });

    try {
      if (fetchConsolidatedInvoice) {
        yield put(updateFetchLoading());
        const page: Page<Invoice[]> = yield call(
          getConsolidatedInvoices,
          fetchConsolidatedInvoice.payload.queryParams
        );
        yield put(
          fetchInvoicesSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isPaymentLoading: false,
              })),
            },
          })
        );
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchInvoicesFailure());
    }
  }
}

function* handleCreatePostPaidOrders() {
  while (true) {
    const {
      payload: { ppid },
    }: ReturnType<typeof createPostPaidOrdersAction> = yield take(
      createPostPaidOrdersAction
    );
    try {
      yield put(updateLoadingForPayment({ ppid }));
      const vnpayUrl: string = yield call(createPostPaidOrders, ppid);
      yield put(createPostPaidOrdersSuccess({ ppid }));

      window.location.href = vnpayUrl;
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createPostPaidOrdersFailure({ ppid }));
    }
  }
}

export const invoiceSagas = [
  fork(handleFetchInvoices),
  fork(handleCreatePostPaidOrders),
];
