import httpStatus from "http-status";
import CustomAPIError from "./custom-error.error";

class NotFoundError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = httpStatus.NOT_FOUND;
  }
}

export default NotFoundError;
