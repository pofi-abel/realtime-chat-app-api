import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const errorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  let customError = {
    statusCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wrong tryagain later",
  };

    if ((error.name == "ValidationError")) {
    customError.message = Object.values(error.errors)
      .map((item: any) => item._message)
      .join(".");
    customError.statusCode = httpStatus.BAD_REQUEST;
  }
  if (error.code && error.code == 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )}, please choose another value`;
    customError.statusCode = httpStatus.BAD_REQUEST;
  } 

  if (error.name === "CastError") {
    customError.message = `No item found with id : ${error.value}`;
    customError.statusCode = httpStatus.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({ message: customError.message });
};

export default errorHandlerMiddleware;