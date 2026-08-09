import { apiClient } from "@/api/axios";

export interface UploadResponse {
  url: string;
}

export interface MultiUploadResponse {
  urls: string[];
}

export async function uploadImageRequest(file: File, folder: string = "items"): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadResponse>(`/upload/image?folder=${folder}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function uploadImagesRequest(files: File[], folder: string = "items"): Promise<MultiUploadResponse> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiClient.post<MultiUploadResponse>(`/upload/images?folder=${folder}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
