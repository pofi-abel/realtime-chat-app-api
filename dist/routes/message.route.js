"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = __importDefault(require("../controller/message.controller"));
const protect_route_middleware_1 = __importDefault(require("../middlewares/protect-route.middleware"));
const router = express_1.default.Router();
router.get("/:userToChatId", protect_route_middleware_1.default, message_controller_1.default.GET_MESSAGES);
router.post("/send/:receiverId", protect_route_middleware_1.default, message_controller_1.default.SEND);
exports.default = router;
