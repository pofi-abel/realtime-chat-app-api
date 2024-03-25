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
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_util_1 = __importDefault(require("../utils/generateToken.util"));
class AuthController {
}
_a = AuthController;
AuthController.SIGNUP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (password != confirmPassword)
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: "Password don't match" });
        const user = yield user_model_1.default.findOne({ username });
        if (user)
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: "Username already exists" });
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new user_model_1.default({
            fullName,
            username,
            gender,
            password: hashedPassword,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        if (newUser) {
            yield (0, generateToken_util_1.default)(newUser._id, res);
            newUser.save();
            res.status(http_status_1.default.CREATED).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }
        else {
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("[Error in sign-up controller]", error.message);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});
AuthController.LOGIN = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { username, password } = req.body;
        const user = yield user_model_1.default.findOne({ username });
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, (_b = user === null || user === void 0 ? void 0 : user.password) !== null && _b !== void 0 ? _b : "");
        if (!user || !isPasswordCorrect)
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: "Invalid credentials" });
        yield (0, generateToken_util_1.default)(user._id, res);
        res.status(http_status_1.default.OK).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("[Error in login controller]", error.message);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});
AuthController.LOGOUT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(http_status_1.default.OK).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("[Error in logout controller]", error.message);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});
exports.default = AuthController;
