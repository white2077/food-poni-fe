import { AxiosResponse } from "axios";
import { FileUpload, Page } from "@/type/types";
import { accessToken, apiWithToken } from "@/utils/axiosConfig";



export const getFileUploads = (): Promise<Page<FileUpload[]>> => {
  return apiWithToken()
    .get('/file-uploads', {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<FileUpload[]>>) => {
      console.log('API response:', res.data);
      return res.data;
    });
};

export const uploadFile = ( file: File): Promise<FileUpload> => {
  const formData = new FormData();
  formData.append('multipartFile', file);

  return apiWithToken()
    .post("/file-uploads", formData, {
      headers: {
        Authorization: "Bearer " + accessToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse<FileUpload>) => res.data);
};

export const getFileById = ( fileId: string): Promise<FileUpload> => {
  return apiWithToken()
    .get(`/file-uploads/${fileId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<FileUpload>) => res.data);
};
