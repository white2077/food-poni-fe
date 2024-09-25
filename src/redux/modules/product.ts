import {createSlice} from "@reduxjs/toolkit";
import {CurrentUser, Page, Product} from "@/type/types.ts";
import {call, fork, take, race, select, put} from "redux-saga/effects";
import {getProductsPage, getProductsPageByRetailer} from "@/utils/api/product.ts";
import {RootState} from "@/redux/store.ts";
import {notification} from "antd";
import {QueryParams} from "@/utils/api/common.ts";

export interface ProductState {
    data: {
        page: Page<Product[]>,
        isLoading: boolean
    },
}

const initialState: ProductState = {
    data: {
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
        isLoading: true
    }
}

const SLICE_NAME = 'product';

const productListSlide = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        fetchProductByCustomerRequest: (state, payload: { payload: string | undefined }) => {
            state.data.isLoading = true;
        },
        fetchProductByRetailerRequest: (state) => {
            state.data.isLoading = true;
        },
        fetchProductSuccess: (state, {payload}: { payload: Page<Product[]> }) => {
            state.data.page = payload;
            state.data.isLoading = false;
        },
        fetchProductFailure: (state) => {
            state.data.isLoading = false;
        }
    }
});
export default productListSlide.reducer;

export const {
    fetchProductByCustomerRequest,
    fetchProductByRetailerRequest,
    fetchProductSuccess,
    fetchProductFailure
} = productListSlide.actions;

function* handleFetchProduct() {
    while (true) {
        const {fetchProductByCustomer, fetchProductByRetailer}: {
            fetchProductByCustomer: ReturnType<typeof fetchProductByCustomerRequest>,
            fetchProductByRetailer: ReturnType<typeof fetchProductByRetailerRequest>
        } = yield race({
            fetchProductByCustomer: take(fetchProductByCustomerRequest.type),
            fetchProductByRetailer: take(fetchProductByRetailerRequest.type)
        });
        try {
            const queryParams: QueryParams = {
                pageSize: 10,
                page: 0,
                status: true
            };

            if (fetchProductByCustomer) {
                queryParams.sort = fetchProductByCustomer.payload;
                const page: Page<Product[]> = yield call(getProductsPage, queryParams);
                yield put(fetchProductSuccess(page));
            }

            if (fetchProductByRetailer) {
                const currentUser: CurrentUser = yield select((state: RootState) => state.auth.currentUser);
                const page: Page<Product[]> = yield call(getProductsPageByRetailer, currentUser.id, queryParams);
                yield put(fetchProductSuccess(page));
            }
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });

            yield put(fetchProductFailure());
        }
    }
}

export const productSagas = [fork(handleFetchProduct),];