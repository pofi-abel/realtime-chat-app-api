"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const errorHandlerMiddleware = (error, req, res, next) => {
    let customError = {
        statusCode: error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR,
        message: error.message || "Something went wrong tryagain later",
    };
    if ((error.name == "ValidationError")) {
        customError.message = Object.values(error.errors)
            .map((item) => item._message)
            .join(".");
        customError.statusCode = http_status_1.default.BAD_REQUEST;
    }
    if (error.code && error.code == 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(error.keyValue)}, please choose another value`;
        customError.statusCode = http_status_1.default.BAD_REQUEST;
    }
    if (error.name === "CastError") {
        customError.message = `No item found with id : ${error.value}`;
        customError.statusCode = http_status_1.default.BAD_REQUEST;
    }
    return res.status(customError.statusCode).json({ message: customError.message });
};
exports.default = errorHandlerMiddleware;
