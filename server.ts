import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import connectMongoDb from "./db/connect";

import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import userRoutes from "./routes/uesr.route";

import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import NotFoundMiddleware from "./middlewares/not-found.middleware";

import httpStatus from "http-status";
import { app, server } from "./socket/socket";

const port = process.env.PORT || 4000;

dotenv.config();
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.set("trust proxy", true);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

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
