import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "@/redux/rootSaga.ts";
import { rootReducer } from "@/redux/rootReducer.ts";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([sagaMiddleware]),
  devTools: import.meta.env.DEV,
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
