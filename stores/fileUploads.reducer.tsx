import {createSlice} from "@reduxjs/toolkit";
import {FileUploadsResponseDTO} from "../models/file/FileUploadsResponseAPI";

export interface IFileUploadsState {
    filesUpload: FileUploadsResponseDTO[];
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
        setFileUploads: (state, {payload}: { payload: FileUploadsResponseDTO[] }) => ({
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