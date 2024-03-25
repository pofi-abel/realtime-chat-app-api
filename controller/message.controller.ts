import { Response } from "express";
import httpStatus from "http-status";
import { CustomeRequest } from "../middlewares/protect-route.middleware";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { getRecieverSocketId, io } from "../socket/socket";

class MesssageController {
  static SEND = async (req: CustomeRequest, res: Response) => {
    try {
      const { receiverId } = req.params;
      const { _id: senderId } = req.user;
      const { message } = req.body;

      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });

      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }

      //   await conversation.save();
      //   await newMessage.save();

      // This would run in parallel
      await Promise.all([conversation.save(), newMessage.save()]);

      // socket.io functionality
      const recieverSocketId = getRecieverSocketId(receiverId);
      if (recieverSocketId) {
        io.to(recieverSocketId).emit("newMessage", newMessage);
      }

      res.status(httpStatus.CREATED).json(newMessage);
    } catch (error: any) {
      console.log("[Error in send-message controller]", error.message);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };

  static GET_MESSAGES = async (req: CustomeRequest, res: Response) => {
    try {
      const { userToChatId } = req.params;
      const { _id: senderId } = req.user;

      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages");

      if (!conversation) return res.status(httpStatus.OK).json([]);

      const messages = conversation?.messages;

      res.status(httpStatus.OK).json(messages);
    } catch (error: any) {
      console.log("[Error in get-messages controller]", error.message);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
}

export default MesssageController;
