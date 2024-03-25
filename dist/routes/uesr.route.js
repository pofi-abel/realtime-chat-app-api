"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const protect_route_middleware_1 = __importDefault(require("../middlewares/protect-route.middleware"));
const router = express_1.default.Router();
router.get("/", protect_route_middleware_1.default, user_controller_1.default.GET_USERS);
exports.default = router;
