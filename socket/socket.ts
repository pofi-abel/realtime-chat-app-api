import { Server, Socket } from "socket.io";
import http from "http";
import express, { Express } from "express";

const app: Express = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

export const getRecieverSocketId = (receiverId: string) => {
  // @ts-ignore
  return userSocketMap[receiverId];
}

const userSocketMap = {};

io.on("connection", (socket: Socket) => {
  console.log("[connect user]:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != "undefined") {
    // @ts-ignore
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("[user disconnected]:", socket.id);
    // @ts-ignore
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server };
