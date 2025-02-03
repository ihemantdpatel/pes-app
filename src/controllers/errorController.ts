import { Response, Request, NextFunction } from "express";
import AppError from "utils/appError";
import { NODE_ENV } from "../config/config";

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    // Trusted error: send to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;