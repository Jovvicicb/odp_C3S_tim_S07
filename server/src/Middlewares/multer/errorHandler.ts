import { type ErrorRequestHandler } from "express";
import multer from "multer";

import { FileValidationMessages } from "../../Domain/constants/messages/common/FileValidationMessages";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        message: FileValidationMessages.imageTooLarge,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Error && err.message === FileValidationMessages.imageInvalid) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};