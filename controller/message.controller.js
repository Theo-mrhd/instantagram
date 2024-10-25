import Message from "../model/Message.js";
import User from "../model/User.js";
import { Op } from "sequelize";

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            senderId: userId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: userId,
          },
        ],
      },
      order: [["timestamp", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId, content } = req.body;
    const message = await Message.create({
      senderId: userId,
      receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDiscussion = async (req, res) => {
  try {
    const userId = req.user.id;

    const receivers = await Message.findAll({
      where: { senderId: userId },
    });

    const receiverId = receivers.map((receiver) => receiver.receiverId);

    const users = await User.findAll({
      where: { id: receiverId },
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await message.destroy();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
