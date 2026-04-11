import { type ErrorRequestHandler } from "express";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  next();
};