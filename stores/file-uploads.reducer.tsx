import {createSlice} from "@reduxjs/toolkit";
import {FileUploadAPIResponse} from "../models/file/FileUploadAPIResponse";

export interface IFileUploadsState {
    filesUpload: FileUploadAPIResponse[];
    selectedMultiFile: string[];
}

const initialState: IFileUploadsState = {
    filesUpload: [],
    selectedMultiFile: [],
}

const fileUploadsSlide = createSlice({
    name: 'fileUploads',
    initialState,
    reducers: {
        setFileUploads: (state, {payload}: { payload: FileUploadAPIResponse[] }) => ({
            ...state,
            filesUpload: payload
        }),
        selectedMultiFile: (state, {payload}: { payload: string[] }) => ({
            ...state,
            selectedMultiFile: payload
        }),
        unSelectedMultiFile: (state) => ({
            ...state,
            selectedMultiFile: []
        })
    }
});

export const {setFileUploads, selectedMultiFile, unSelectedMultiFile} = fileUploadsSlide.actions;
export default fileUploadsSlide.reducer;