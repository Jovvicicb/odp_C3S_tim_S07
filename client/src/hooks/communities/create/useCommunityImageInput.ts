import { useState } from "react";
import { FileValidationMessages } from "../../../constants/messages/common/FileValidationMessages";

export function useCommunityImageInput(setError: (message: string) => void) {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const handleImageChange = (file?: File) => {
    if (!file) {
      setAvatar(null);
      setPreview("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError(FileValidationMessages.imageInvalid);
      setAvatar(null);
      setPreview("");
      setFileKey((prev) => prev + 1);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(FileValidationMessages.imageTooLarge);
      setAvatar(null);
      setPreview("");
      setFileKey((prev) => prev + 1);
      return;
    }

    setError("");
    setAvatar(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return {
    avatar,
    preview,
    fileKey,
    handleImageChange,
  };
}
