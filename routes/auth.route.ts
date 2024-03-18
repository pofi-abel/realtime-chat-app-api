import express, { Router } from "express";
import AuthController from "../controller/auth.controller";

const router: Router = express.Router();

router.post("/signup", AuthController.SIGNUP);

router.post("/login", AuthController.LOGIN);

router.post("/logout", AuthController.LOGOUT);

export default router;
