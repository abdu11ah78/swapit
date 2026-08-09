import { useMutation } from "@tanstack/react-query";
import { uploadImageRequest, uploadImagesRequest } from "./upload.api";

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadImageRequest(file, folder),
  });
};

export const useUploadImagesMutation = () => {
  return useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder?: string }) =>
      uploadImagesRequest(files, folder),
  });
};
