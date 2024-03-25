"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.NotFoundError = exports.UnauthenticatedError = exports.CustomAPIError = void 0;
const custom_error_error_1 = __importDefault(require("./custom-error.error"));
exports.CustomAPIError = custom_error_error_1.default;
const unauthenticated_error_1 = __importDefault(require("./unauthenticated.error"));
exports.UnauthenticatedError = unauthenticated_error_1.default;
const not_found_error_1 = __importDefault(require("./not-found.error"));
exports.NotFoundError = not_found_error_1.default;
const bad_request_error_1 = __importDefault(require("./bad-request.error"));
exports.BadRequestError = bad_request_error_1.default;
