import { RootState } from "@/redux/store";
import { FileUpload, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import {
  deleteFileById,
  getFileUploads,
  uploadFile,
} from "@/utils/api/fileUploads";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { call, fork, put, select, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type FileUploadsState = {
  readonly page: Page<Array<FileUpload & { isDeleteLoading: boolean }>>;
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
      action: PayloadAction<{ page: FileUploadsState["page"] }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchFileUploadsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForUploadingSuccess: (state) => ({
      ...state,
      isUploadLoading: true,
    }),
    uploadFileSuccess: (
      state,
      action: PayloadAction<{
        fileUpload: FileUploadsState["page"]["content"][0];
      }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: [...state.page.content, action.payload.fileUpload],
      },
      selectedMultiFile: [
        ...state.selectedMultiFile,
        action.payload.fileUpload.url,
      ],
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
    updateLoadingForDeleting: (
      state,
      action: PayloadAction<{ fileId: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((item) => {
          if (item.id === action.payload.fileId) {
            return { ...item, isDeleteLoading: true };
          }
          return item;
        }),
      },
    }),
    deleteFileSuccess: (state, action: PayloadAction<{ fileId: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.filter(
          (file) => file.id !== action.payload.fileId
        ),
      },
    }),
    deleteFileFailure: (state, action: PayloadAction<{ fileId: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((item) => {
          if (item.id === action.payload.fileId) {
            return { ...item, isDeleteLoading: false };
          }
          return item;
        }),
      },
    }),
  },
});

export const {
  updateFetchLoadingSuccess,
  fetchFileUploadsSuccess,
  fetchFileUploadsFailure,
  updateLoadingForUploadingSuccess,
  uploadFileSuccess,
  uploadFileFailure,
  setSelectedMultiFile,
  unSelectedMultiFile,
  setShowModalFileUpload,
  updateFileUploadForm,
  updateLoadingForDeleting,
  deleteFileSuccess,
  deleteFileFailure,
} = fileUploadsSlice.actions;

export default fileUploadsSlice.reducer;

export const fetchFileUploadsAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchFileUploadsAction`);
export const uploadFileAction = createAction(`${SLICE_NAME}/uploadFileAction`);
export const deleteFileAction = createAction<string>(
  `${SLICE_NAME}/deleteFileAction`
);

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
      yield put(
        fetchFileUploadsSuccess({
          page: {
            ...page,
            content: page.content.map((item) => ({
              ...item,
              isDeleteLoading: false,
            })),
          },
        })
      );
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
      yield put(updateLoadingForUploadingSuccess());
      const { form } = yield select((state: RootState) => state.fileUpload);
      const response: FileUpload = yield call(uploadFile, form.file);
      yield put(
        uploadFileSuccess({
          fileUpload: { ...response, isDeleteLoading: false },
        })
      );
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

function* deleteFile(fileId: string) {
  yield call(deleteFileById, fileId);
  yield put(deleteFileSuccess({ fileId }));
  notification.success({
    message: "Xóa thành công",
    description: "File đã được xóa thành công.",
  });
}

function* handleDeleteFile() {
  while (true) {
    const { payload: fileId }: ReturnType<typeof deleteFileAction> =
      yield take(deleteFileAction);
    try {
      yield put(updateLoadingForDeleting({ fileId }));
      yield fork(deleteFile, fileId);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(deleteFileFailure({ fileId }));
    }
  }
}

export const fileUploadsSagas = [
  fork(handleFetchFileUploads),
  fork(handleUploadFile),
  fork(handleDeleteFile),
];
