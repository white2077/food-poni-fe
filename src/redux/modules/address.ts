import {createSlice} from "@reduxjs/toolkit";
import {Address, Page} from "@/type/types.ts";
import {call, fork, put, select, take} from "redux-saga/effects";
import {notification} from "antd";
import {QueryParams} from "@/utils/api/common.ts";
import {createAddress, getAddressesPage} from "@/utils/api/address.ts";
import {updateShippingAddressAction} from "@/redux/modules/order.ts";
import {RootState} from "@/redux/store.ts";

export type AddressState = {
    readonly page: Page<{
        readonly id: string;
        readonly fullName: string;
        readonly phoneNumber: string;
        readonly address: string;
        readonly lon: number;
        readonly lat: number;
    }[]>,
    readonly isFetchLoading: boolean,
    readonly isCreateLoading: boolean,
}

const initialState: AddressState = {
    page: {
        content: [
            {
                id: "",
                fullName: "",
                phoneNumber: "",
                address: "",
                lon: 0,
                lat: 0
            }
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
    isFetchLoading: false,
    isCreateLoading: false,
}

const SLICE_NAME = 'address';

const addressSlide = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        fetchAddressesRequest: (state, {payload}: { payload: string | undefined }) => ({
            ...state,
            isFetchLoading: true
        }),
        fetchAddressesSuccess: (state, {payload}: { payload: Page<Address[]> }) => ({
            ...state,
            page: {
                ...state.page,
                content: payload.content.map((it) => {
                    return {
                        ...it
                    }
                })
            },
            isFetchLoading: false
        }),
        fetchAddressesFailure: (state) => ({
            ...state,
            isFetchLoading: false
        }),
        createAddressRequest: (state, {payload}: {
            payload: {
                readonly fullName: string;
                readonly phoneNumber: string;
                readonly address: string;
                readonly lon: number;
                readonly lat: number;
            }
        }) => ({
            ...state,
            isCreateLoading: true
        }),
        createAddressSuccess: (state, {payload}: {
            payload: {
                readonly id: string;
                readonly fullName: string;
                readonly phoneNumber: string;
                readonly address: string;
                readonly lon: number;
                readonly lat: number;
            }
        }) => ({
            ...state,
            page: {
                ...state.page,
                content: [...state.page.content, payload]
            },
            isCreateLoading: false
        }),
        createAddressFailure: (state) => ({
            ...state,
            isCreateLoading: false
        }),
    }
});
export default addressSlide.reducer;

export const {
    fetchAddressesRequest,
    fetchAddressesSuccess,
    fetchAddressesFailure,
    createAddressRequest,
    createAddressSuccess,
    createAddressFailure,
} = addressSlide.actions;

function* handleFetchAddress() {
    while (true) {
        const {payload}: ReturnType<typeof fetchAddressesRequest> = yield take(fetchAddressesRequest.type);
        try {
            const queryParams: QueryParams = {
                pageSize: 10,
                page: 0,
                status: true
            };

            queryParams.sort = payload;
            const page: Page<Address[]> = yield call(getAddressesPage, queryParams);

            yield put(fetchAddressesSuccess(page));
            const {currentUser} = yield select((state: RootState) => state.auth);
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
        const {payload}: ReturnType<typeof createAddressRequest> = yield take(createAddressRequest.type);
        try {
            yield call(createAddress, {
                fullName: payload.fullName,
                phoneNumber: payload.phoneNumber,
                address: payload.address,
                lon: payload.lon,
                lat: payload.lat
            });
            const address: {
                readonly id: string;
                readonly fullName: string;
                readonly phoneNumber: string;
                readonly address: string;
                readonly lon: number;
                readonly lat: number;
            } = {
                id: "",
                fullName: payload.fullName,
                phoneNumber: payload.phoneNumber,
                address: payload.address,
                lon: payload.lon,
                lat: payload.lat
            }
            yield put(createAddressSuccess(address));
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

export const shippingAddressSagas = [
    fork(handleFetchAddress),
    fork(handleCreateAddress)
];