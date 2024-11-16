import { Invoice, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import { getConsolidatedInvoices } from "@/utils/api/invoice";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { call, fork, put, race, take } from "redux-saga/effects";

export type InvoiceState = {
  readonly page: Page<Invoice[]>;
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
      action: PayloadAction<{ page: Page<Invoice[]> }>
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
  },
});

export default invoiceSlice.reducer;

export const {
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  updateFetchLoading,
} = invoiceSlice.actions;
export const fetchConsolidatedInvoiceAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchConsolidatedInvoiceRequest`);

function* handleFetchInvoices() {
  while (true) {
    const {
      fetchConsolidatedInvoice,
    }: {
      fetchConsolidatedInvoice: ReturnType<typeof fetchConsolidatedInvoiceAction>;
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
        yield put(fetchInvoicesSuccess({ page }));
      }
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchInvoicesFailure());
    }
  }
}

export const invoiceSagas = [fork(handleFetchInvoices)];
