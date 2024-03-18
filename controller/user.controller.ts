import { Response } from "express";
import httpStatus from "http-status";
import { CustomeRequest } from "../middlewares/protect-route.middleware";
import User from "../models/user.model";

class UserController {
  static GET_USERS = async (req: CustomeRequest, res: Response) => {
    try {
      const { _id: loggedInUserId } = req.user;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        res.status(httpStatus.OK).json(filteredUsers);
    } catch (error: any) {
      console.log("[Error in get-users controller]", error.message);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
}

export default UserController;
