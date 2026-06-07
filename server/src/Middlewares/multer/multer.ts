import multer from "multer";
import path from "path";
import fs from "fs";

import { FileValidationMessages } from "../../Domain/constants/messages/common/FileValidationMessages";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const mimeTypeToExtension: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const allowedTypes = Object.keys(mimeTypeToExtension);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const ext = mimeTypeToExtension[file.mimetype];
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${ext}`;

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error(FileValidationMessages.imageInvalid));
      return;
    }

    cb(null, true);
  },
});