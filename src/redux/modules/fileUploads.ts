import { createSlice } from "@reduxjs/toolkit";
import { FileUploadAPIResponse } from "../models/file/FileUploadAPIResponse";

export interface IFileUploadsState {
  filesUpload: FileUploadAPIResponse[];
  selectedMultiFile: string[];
}

const initialState: IFileUploadsState = {
  filesUpload: [],
  selectedMultiFile: [],
};

const SLICE_NAME = "fileUploads";

const fileUploadsSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setFileUploads: (
      state,
      { payload }: { payload: FileUploadAPIResponse[] },
    ) => ({
      ...state,
      filesUpload: payload,
    }),
    selectedMultiFile: (state, { payload }: { payload: string[] }) => ({
      ...state,
      selectedMultiFile: payload,
    }),
    unSelectedMultiFile: (state) => ({
      ...state,
      selectedMultiFile: [],
    }),
  },
});

export const { setFileUploads, selectedMultiFile, unSelectedMultiFile } =
  fileUploadsSlide.actions;
export default fileUploadsSlide.reducer;
