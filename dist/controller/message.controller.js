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
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const socket_1 = require("../socket/socket");
class MesssageController {
}
_a = MesssageController;
MesssageController.SEND = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiverId } = req.params;
        const { _id: senderId } = req.user;
        const { message } = req.body;
        let conversation = yield conversation_model_1.default.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = yield conversation_model_1.default.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = yield message_model_1.default.create({
            senderId,
            receiverId,
            message,
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        //   await conversation.save();
        //   await newMessage.save();
        // This would run in parallel
        yield Promise.all([conversation.save(), newMessage.save()]);
        // socket.io functionality
        const recieverSocketId = (0, socket_1.getRecieverSocketId)(receiverId);
        if (recieverSocketId) {
            socket_1.io.to(recieverSocketId).emit("newMessage", newMessage);
        }
        res.status(http_status_1.default.CREATED).json(newMessage);
    }
    catch (error) {
        console.log("[Error in send-message controller]", error.message);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});
MesssageController.GET_MESSAGES = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userToChatId } = req.params;
        const { _id: senderId } = req.user;
        const conversation = yield conversation_model_1.default.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");
        if (!conversation)
            return res.status(http_status_1.default.OK).json([]);
        const messages = conversation === null || conversation === void 0 ? void 0 : conversation.messages;
        res.status(http_status_1.default.OK).json(messages);
    }
    catch (error) {
        console.log("[Error in get-messages controller]", error.message);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});
exports.default = MesssageController;
