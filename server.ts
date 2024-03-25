import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectMongoDb from "./db/connect";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import userRoutes from "./routes/uesr.route";

import NotFoundMiddleware from "./middlewares/not-found.middleware";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";

import { app, server } from "./socket/socket";
import path from "path";
import httpStatus from "http-status";

const port = process.env.PORT || 4000;

const dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ app_name: "realtime-chat-app", version: "0.0.1" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(dirname, "/frontend/dist")));
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(dirname, "frontend", "dist", "index.html"));
});

app.use(NotFoundMiddleware);
app.use(errorHandlerMiddleware);

(async () => {
  try {
    await connectMongoDb();
    console.log("[DB]: Connected to MongoDB...");

    server.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process on failure
  }
})();
