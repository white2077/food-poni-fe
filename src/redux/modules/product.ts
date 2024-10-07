import {createAction, createSlice} from "@reduxjs/toolkit";
import {CurrentUser, Page, Product, ProductDetail} from "@/type/types.ts";
import {call, fork, take, race, select, put} from "redux-saga/effects";
import {
    getProductByIdOrSlug,
    getProductsPage,
    getProductsPageByCategory,
    getProductsPageByRetailer
} from "@/utils/api/product.ts";
import {RootState} from "@/redux/store.ts";
import {notification} from "antd";
import {QueryParams} from "@/utils/api/common.ts";
import {getProductDetailsByProductId} from "@/utils/api/productDetail.ts";

export type ProductState = {
    readonly page: Page<Product[]>,
    readonly isLoading: boolean,
    readonly productSelected: {
        readonly product: Product | null | undefined,
        readonly productDetails: ProductDetail[]
    },
    readonly productDetailSelected: ProductDetail | null | undefined
}

const initialState: ProductState = {
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
    isLoading: true,

    productSelected: {
        product: null,
        productDetails: [],
    },
    productDetailSelected: null
}

const SLICE_NAME = 'product';

const productSlide = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        fetchProductsByCustomerRequest: (state, payload: { payload: string | undefined }) => {
            state.isLoading = true;
        },
        fetchProductsByRetailerRequest: (state) => {
            state.isLoading = true;
        },
        fetchProductsByProductCategoryRequest: (state, payload: { payload: string }) => {
            state.isLoading = true;
        },
        fetchProductsSuccess: (state, {payload}: { payload: Page<Product[]> }) => {
            state.page = payload;
            state.isLoading = false;
        },
        fetchProductsFailure: (state) => {
            state.isLoading = false;
        },
        fetchProductSuccess: (state, {payload}: { payload: Product }) => {
            state.productSelected.product = payload;
        },
        fetchProductDetailsSuccess: (state, {payload}: { payload: ProductDetail[] }) => {
            state.productSelected.productDetails = payload;
        },
        updateProductDetailSelected: (state, {payload}: { payload: ProductDetail | null | undefined }) => {
            state.productDetailSelected = payload
        }
    }
});
export default productSlide.reducer;

export const {
    fetchProductsByCustomerRequest,
    fetchProductsByRetailerRequest,
    fetchProductsByProductCategoryRequest,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchProductSuccess,
    fetchProductDetailsSuccess,
    updateProductDetailSelected
} = productSlide.actions;

export const fetchProductAction = createAction<string>(`${SLICE_NAME}/fetchProductRequest`);

function* handleFetchProducts() {
    while (true) {
        const {fetchProductByCustomer, fetchProductByRetailer, fetchProductsByProductCategory}: {
            fetchProductByCustomer: ReturnType<typeof fetchProductsByCustomerRequest>,
            fetchProductByRetailer: ReturnType<typeof fetchProductsByRetailerRequest>,
            fetchProductsByProductCategory: ReturnType<typeof fetchProductsByProductCategoryRequest>
        } = yield race({
            fetchProductByCustomer: take(fetchProductsByCustomerRequest.type),
            fetchProductByRetailer: take(fetchProductsByRetailerRequest.type),
            fetchProductsByProductCategory: take(fetchProductsByProductCategoryRequest.type)
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
                yield put(fetchProductsSuccess(page));
            }

            if (fetchProductByRetailer) {
                const currentUser: CurrentUser = yield select((state: RootState) => state.auth.currentUser);
                const page: Page<Product[]> = yield call(getProductsPageByRetailer, currentUser.id, queryParams);
                yield put(fetchProductsSuccess(page));
            }

            if (fetchProductsByProductCategory) {
                const page: Page<Product[]> = yield call(getProductsPageByCategory, fetchProductsByProductCategory.payload, queryParams);
                yield put(fetchProductsSuccess(page));
            }

        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });

            yield put(fetchProductsFailure());
        }
    }
}

function* handleFetchProduct() {
    while (true) {
        const {payload}: ReturnType<typeof fetchProductAction> = yield take(fetchProductAction.type);
        try {

            const product: Product = yield call(getProductByIdOrSlug, payload);
            yield fork(handleFetchProductDetails, product.id);
            yield put(fetchProductSuccess(product));

        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });

            yield put(fetchProductsFailure());
        }
    }
}

function* handleFetchProductDetails(pid: string) {
    try {
        const {content}: Page<ProductDetail[]> = yield call(getProductDetailsByProductId, pid);
        yield put(fetchProductDetailsSuccess(content));
        yield put(updateProductDetailSelected(content[0]));
    } catch (e) {
        notification.open({
            message: "Error",
            description: e.message,
            type: "error",
        });

        yield put(fetchProductsFailure());
    }
}

export const productSagas = [fork(handleFetchProducts), fork(handleFetchProduct)];