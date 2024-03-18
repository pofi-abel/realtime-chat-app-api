import httpStatus from "http-status";
import CustomAPIError from "./custom-error.error";

class BadRequestError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = httpStatus.BAD_REQUEST;
  }
}

export default BadRequestError;
