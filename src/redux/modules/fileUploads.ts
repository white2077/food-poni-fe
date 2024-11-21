import { RootState } from "@/redux/store";
import { FileUpload, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import { getFileUploads, uploadFile } from "@/utils/api/fileUploads";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { call, fork, put, select, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type FileUploadsState = {
  readonly page: Page<FileUpload[]>;
  readonly isFetchLoading: boolean;
  readonly isUploadLoading: boolean;
  readonly selectedMultiFile: string[];
  readonly showModalFileUpload: boolean;
  readonly form: {
    file: File | null;
  };
};

const initialState: FileUploadsState = {
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
  isUploadLoading: false,
  selectedMultiFile: [],
  showModalFileUpload: false,
  form: {
    file: null,
  },
};

const SLICE_NAME = "fileUploads";

const fileUploadsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchFileUploadsSuccess: (
      state,
      action: PayloadAction<{ page: Page<FileUpload[]> }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchFileUploadsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    uploadFileRequest: (state) => ({
      ...state,
      isUploadLoading: true,
    }),
    uploadFileSuccess: (state, action: PayloadAction<FileUpload>) => ({
      ...state,
      page: {
        ...state.page,
        content: [...state.page.content, action.payload],
      },
      selectedMultiFile: [...state.selectedMultiFile, action.payload.url],
      isUploadLoading: false,
      form: { file: null },
    }),
    uploadFileFailure: (state) => ({
      ...state,
      isUploadLoading: false,
    }),
    setSelectedMultiFile: (state, action: PayloadAction<string[]>) => ({
      ...state,
      selectedMultiFile: action.payload,
    }),
    unSelectedMultiFile: (state) => ({
      ...state,
      selectedMultiFile: [],
    }),
    setShowModalFileUpload: (state, action: PayloadAction<boolean>) => ({
      ...state,
      showModalFileUpload: action.payload,
    }),
    updateFileUploadForm: (
      state,
      action: PayloadAction<Partial<FileUploadsState["form"]>>
    ) => ({
      ...state,
      form: { ...state.form, ...action.payload },
    }),
  },
});

export const {
  updateFetchLoadingSuccess,
  fetchFileUploadsSuccess,
  fetchFileUploadsFailure,
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
  setSelectedMultiFile,
  unSelectedMultiFile,
  setShowModalFileUpload,
  updateFileUploadForm,
} = fileUploadsSlice.actions;

export default fileUploadsSlice.reducer;

export const fetchFileUploadsAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchFileUploadsAction`);
export const uploadFileAction = createAction(`${SLICE_NAME}/uploadFileAction`);

function* handleFetchFileUploads() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchFileUploadsAction> = yield take(
      fetchFileUploadsAction
    );
    try {
      yield put(updateFetchLoadingSuccess());
      const page: Page<FileUpload[]> = yield call(getFileUploads, queryParams);
      yield put(fetchFileUploadsSuccess({ page }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchFileUploadsFailure());
    }
  }
}

function* handleUploadFile() {
  while (true) {
    yield take(uploadFileAction);
    try {
      yield put(uploadFileRequest());
      const { form } = yield select((state: RootState) => state.fileUpload);
      if (!form.file) {
        throw new Error("No file selected");
      }
      const response: FileUpload = yield call(uploadFile, form.file);
      yield put(uploadFileSuccess(response));
      notification.success({
        message: "Upload thành công",
        description: "File đã được tải lên thành công.",
      });
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(uploadFileFailure());
    }
  }
}

export const fileUploadsSagas = [
  fork(handleFetchFileUploads),
  fork(handleUploadFile),
];
