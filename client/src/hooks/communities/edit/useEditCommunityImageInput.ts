import { useRef, useState } from "react";

import { ImageHelper } from "../../../helpers/images/ImageHelper";

export function useEditCommunityImageInput(
  currentAvatar: string | null,
  setError: (message: string) => void,
) {
  const [avatar, setAvatar] = useState<File | undefined>();
  const [selectedPreview, setSelectedPreview] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const objectUrlRef = useRef<string>("");

  const currentPreview = removeAvatar
    ? ""
    : ImageHelper.getImageUrl(currentAvatar) ?? "";

  const preview = selectedPreview || currentPreview;

  const clearObjectUrl = () => {
    if (!objectUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = "";
  };

  const handleImageChange = (file?: File) => {
    setError("");

    clearObjectUrl();

    if (!file) {
      setAvatar(undefined);
      setSelectedPreview("");
      return;
    }

    const nextPreview = URL.createObjectURL(file);

    objectUrlRef.current = nextPreview;
    setAvatar(file);
    setSelectedPreview(nextPreview);
    setRemoveAvatar(false);
  };

  const handleRemoveImage = () => {
    setError("");

    clearObjectUrl();

    setAvatar(undefined);
    setSelectedPreview("");
    setRemoveAvatar(true);
    setFileKey((current) => current + 1);
  };

  return {
    avatar,
    preview,
    fileKey,
    removeAvatar,
    handleImageChange,
    handleRemoveImage,
  };
}