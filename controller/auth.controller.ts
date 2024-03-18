import bcrpyt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import User from "../models/user.model";
import generateTokenAndSetCookie from "../utils/generateToken.util";

class AuthController {
  static SIGNUP = async (req: Request, res: Response) => {
    try {
      const { fullName, username, password, confirmPassword, gender } = req.body;

      if (password != confirmPassword)
        return res.status(httpStatus.BAD_REQUEST).json({ error: "Password don't match" });

      const user = await User.findOne({ username });

      if (user)
        return res.status(httpStatus.BAD_REQUEST).json({ error: "Username already exists" });

      const salt = await bcrpyt.genSalt(10);
      const hashedPassword = await bcrpyt.hash(password, salt);

      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

      const newUser = new User({
        fullName,
        username,
        gender,
        password: hashedPassword,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      });

      if (newUser) {
        await generateTokenAndSetCookie(newUser._id as unknown as ObjectId, res);
        newUser.save();

        res.status(httpStatus.CREATED).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePic: newUser.profilePic,
        });
      } else {
        return res.status(httpStatus.BAD_REQUEST).json({ error: "Invalid user data" });
      }
    } catch (error: any) {
      console.log("[Error in sign-up controller]", error.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };

  static LOGIN = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      const isPasswordCorrect = await bcrpyt.compare(password, (user?.password as string) ?? "");

      if (!user || !isPasswordCorrect)
        return res.status(httpStatus.BAD_REQUEST).json({ error: "Invalid credentials" });

      await generateTokenAndSetCookie(user._id as unknown as ObjectId, res);

      res.status(httpStatus.OK).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
      });
    } catch (error: any) {
      console.log("[Error in login controller]", error.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };

  static LOGOUT = async (req: Request, res: Response) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(httpStatus.OK).json({ message: "Logged out successfully" });
    } catch (error: any) {
      console.log("[Error in logout controller]", error.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
}

export default AuthController;
