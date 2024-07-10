import {createSlice} from "@reduxjs/toolkit";
import {FileUploadAPIResponse} from "../models/file/FileUploadAPIResponse";

export interface IFileUploadsState {
    filesUpload: FileUploadAPIResponse[];
    selectedFile: string[];
}

const initialState: IFileUploadsState = {
    filesUpload: [],
    selectedFile: []
}

const fileUploadsSlide = createSlice({
    name: 'fileUploads',
    initialState,
    reducers: {
        setFileUploads: (state, {payload}: { payload: FileUploadAPIResponse[] }) => ({
            ...state,
            filesUpload: payload
        }),
        setSelectedFile: (state, {payload}: { payload: string[] }) => ({
            ...state,
            selectedFile: payload
        })
    }
});

export const {setFileUploads,setSelectedFile} = fileUploadsSlide.actions;
export default fileUploadsSlide.reducer;