import { all } from 'redux-saga/effects'
import {notificationSagas} from "@/redux/modules/notification.ts";
import {authSagas} from "@/redux/modules/auth.ts";
import {productSagas} from "@/redux/modules/product.ts";
export default function* rootSaga() {
    yield all([
        ...authSagas,
        ...notificationSagas,
        ...productSagas,
    ])
}