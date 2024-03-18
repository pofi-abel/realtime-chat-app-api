import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectMongoDb from "./db/connect";
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route"
import userRoutes from "./routes/uesr.route"

import NotFoundMiddleware from "./middlewares/not-found.middleware";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";

const app: Express = express();
const port = process.env.PORT || 4000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
    res.send("Chat-app(mern)");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

app.use(NotFoundMiddleware);
app.use(errorHandlerMiddleware);

(async () => {
  try {
    await connectMongoDb();
    console.log("[DB]: Connected to MongoDB...");

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process on failure
  }
})();
