import { useState } from "react";

import { FileValidationMessages } from "../../../constants/messages/common/FileValidationMessages";

export function useRegisterImageInput(setError: (message: string) => void) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const handleImageChange = (file?: File) => {
    if (!file) {
      setImageFile(null);
      setPreview("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError(FileValidationMessages.imageInvalid);
      setImageFile(null);
      setPreview("");
      setFileKey((prev) => prev + 1);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(FileValidationMessages.imageTooLarge);
      setImageFile(null);
      setPreview("");
      setFileKey((prev) => prev + 1);
      return;
    }

    setError("");
    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return {
    imageFile,
    preview,
    fileKey,
    handleImageChange,
  };
}