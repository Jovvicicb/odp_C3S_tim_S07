import multer from "multer";
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
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
      cb(new Error("Only JPG, PNG or WEBP images are allowed"));
      return;
    }

    cb(null, true);
  },
});