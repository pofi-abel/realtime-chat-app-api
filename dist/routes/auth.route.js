"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const router = express_1.default.Router();
router.post("/signup", auth_controller_1.default.SIGNUP);
router.post("/login", auth_controller_1.default.LOGIN);
router.post("/logout", auth_controller_1.default.LOGOUT);
exports.default = router;
