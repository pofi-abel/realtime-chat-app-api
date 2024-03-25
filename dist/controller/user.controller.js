"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../models/user.model"));
class UserController {
}
_a = UserController;
UserController.GET_USERS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id: loggedInUserId } = req.user;
        const filteredUsers = yield user_model_1.default.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(http_status_1.default.OK).json(filteredUsers);
    }
    catch (error) {
        console.log("[Error in get-users controller]", error.message);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});
exports.default = UserController;
