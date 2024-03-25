"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.getRecieverSocketId = exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
const getRecieverSocketId = (receiverId) => {
    // @ts-ignore
    return userSocketMap[receiverId];
};
exports.getRecieverSocketId = getRecieverSocketId;
const userSocketMap = {};
exports.io.on("connection", (socket) => {
    console.log("[connect user]:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId != "undefined") {
        // @ts-ignore
        userSocketMap[userId] = socket.id;
    }
    exports.io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("[user disconnected]:", socket.id);
        // @ts-ignore
        delete userSocketMap[userId];
        exports.io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
