import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export interface CustomeRequest extends Request {
  user?: any;
}

const protectRoute = async (req: CustomeRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "Unauthorised - No Token Provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded)
      return res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorised - Invalid Token" });

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    console.log("[Error in protect-route middleware]", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export default protectRoute;
