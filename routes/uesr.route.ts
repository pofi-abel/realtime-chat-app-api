import express, { Router } from "express";
import UserController from "../controller/user.controller";
import protectRoute from "../middlewares/protect-route.middleware";

const router: Router = express.Router();

router.get("/", protectRoute, UserController.GET_USERS);

export default router;
