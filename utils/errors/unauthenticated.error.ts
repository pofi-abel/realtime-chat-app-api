import httpStatus from "http-status";
import CustomAPIError from "./custom-error.error";

class UnauthenticatedError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = httpStatus.NOT_FOUND;
  }
}

export default UnauthenticatedError;
