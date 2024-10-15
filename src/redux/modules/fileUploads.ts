import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, put, fork, take } from "redux-saga/effects";
import { notification } from "antd";

import { FileUpload, Page } from "@/type/types";
import { getFileUploads, uploadFile } from "@/utils/api/fileUploads";

export type FileUploadsState = {
  readonly filesUpload: FileUpload[];
  readonly selectedMultiFile: string[];
  readonly isUploading: boolean;
  readonly error: string | null;
};

const initialState: FileUploadsState = {
  filesUpload: [],
  selectedMultiFile: [],
  isUploading: false,
  error: null,
};

const SLICE_NAME = "fileUploads";

const fileUploadsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setFileUploads: (state, { payload }: PayloadAction<FileUpload[]>) => ({
      ...state,
      filesUpload: payload,
    }),
    selectedMultiFile: (state, { payload }: PayloadAction<string[]>) => ({
      ...state,
      selectedMultiFile: payload,
    }),
    unSelectedMultiFile: (state) => ({
      ...state,
      selectedMultiFile: [],
    }),
    uploadFileRequest: (state, action: PayloadAction<{ refreshToken: string; file: File }>) => ({
      ...state,
      isUploading: true,
      error: null,
    }),
    uploadFileSuccess: (state, { payload }: PayloadAction<FileUpload>) => ({
      ...state,
      filesUpload: [...state.filesUpload, payload],
      selectedMultiFile: [...state.selectedMultiFile, payload.url],
      isUploading: false,
    }),
    uploadFileFailure: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      isUploading: false,
      error: payload,
    }),
    fetchFileUploadsRequest: (state, action: PayloadAction<string>) => ({
      ...state,
      isUploading: true,
      error: null,
    }),
    fetchFileUploadsSuccess: (state, { payload }: PayloadAction<FileUpload[]>) => ({
      ...state,
      filesUpload: payload,
      isUploading: false,
    }),
    fetchFileUploadsFailure: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      isUploading: false,
      error: payload,
    }),
  },
});

export default fileUploadsSlice.reducer;

export const {
  setFileUploads,
  selectedMultiFile,
  unSelectedMultiFile,
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
  fetchFileUploadsRequest,
  fetchFileUploadsSuccess,
  fetchFileUploadsFailure,
} = fileUploadsSlice.actions;

function* handleFileUpload() {
  while (true) {
    const { payload }: ReturnType<typeof uploadFileRequest> = yield take(uploadFileRequest);
    try {
      const response: FileUpload = yield call(uploadFile, payload.file);
      yield put(uploadFileSuccess(response));
      yield put(fetchFileUploadsRequest(payload.refreshToken));
      notification.success({
        message: "Upload thành công",
        description: "File đã được tải lên thành công.",
      });
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(uploadFileFailure(e.message));
    }
  }
}

function* handleFetchFileUploads() {
  while (true) {
    yield take(fetchFileUploadsRequest);
    try {
      const response: Page<FileUpload[]> = yield call(getFileUploads);
      if (response && response.content) {
        yield put(fetchFileUploadsSuccess(response.content));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (e) {
      console.error("Error fetching file uploads:", e);
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchFileUploadsFailure(e.message));
    }
  }
}

export const fileUploadsSagas = [
  fork(handleFileUpload),
  fork(handleFetchFileUploads),
];