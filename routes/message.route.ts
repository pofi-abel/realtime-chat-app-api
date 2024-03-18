import express, { Router } from "express";
import MesssageController from "../controller/message.controller";
import protectRoute from "../middlewares/protect-route.middleware";

const router: Router = express.Router();

router.get("/:userToChatId", protectRoute, MesssageController.GET_MESSAGES);
router.post("/send/:receiverId", protectRoute, MesssageController.SEND);

export default router; 