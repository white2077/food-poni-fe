
export interface FileUploadAPIResponse {

    id: string;

    name: string;

    extension: string;

    contentType: string;

    size: number;

    url: string;

}

export const INITIAL_FILE_UPLOAD_API_RESPONSE: FileUploadAPIResponse = {
    id: '',
    name: '',
    extension: '',
    contentType: '',
    size: 0,
    url: '',
}