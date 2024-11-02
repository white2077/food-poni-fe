import { AxiosResponse } from "axios";
import { FileUpload, Page } from "@/type/types";
import { accessToken, apiWithToken } from "@/utils/axiosConfig";
import generateQueryString, { QueryParams } from "./common";

export const getFileUploads = (
  queryParams: QueryParams
): Promise<Page<FileUpload[]>> => {
  return apiWithToken()
    .get(generateQueryString("/file-uploads", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<FileUpload[]>>) => res.data);
};

export const uploadFile = (file: File): Promise<FileUpload> => {
  const formData = new FormData();
  formData.append("multipartFile", file);

  return apiWithToken()
    .post("/file-uploads", formData, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res: AxiosResponse<FileUpload>) => res.data);
};

export const getFileById = (fileId: string): Promise<FileUpload> => {
  return apiWithToken()
    .get(`/file-uploads/${fileId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<FileUpload>) => res.data);
};
