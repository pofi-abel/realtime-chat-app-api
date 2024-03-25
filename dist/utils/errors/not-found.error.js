"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const custom_error_error_1 = __importDefault(require("./custom-error.error"));
class NotFoundError extends custom_error_error_1.default {
    constructor(message) {
        super(message);
        this.statusCode = http_status_1.default.NOT_FOUND;
    }
}
exports.default = NotFoundError;
