import { Server } from "socket.io";
import Message from "../model/Message.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export class Socket extends Server {
  constructor(port) {
    super(port, {
      cors: {
        origin: "*",
      },
    });

    this.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
          if (err) return next(new Error("Authentication error"));
          socket.userId = decoded.id;
          next();
        });
      } else {
        next(new Error("Authentication error"));
      }
    });

    this.init();
  }

  init() {
    this.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("join", (receiverId) => {
        const userId = socket.userId;
        const room = [userId, receiverId].sort().join("_");
        socket.join(room);
        console.log(`User ${userId} joined room: ${room}`);
      });

      socket.on("message", async (msg) => {
        try {
          const { receiverId, content } = msg;
          const userId = socket.userId;

          const message = await Message.create({
            senderId: userId,
            receiverId,
            content,
          });

          const room = [userId, receiverId].sort().join("_");
          this.to(room).emit("message", message);
        } catch (error) {
          console.error("Error creating message:", error);
        }
      });
    });
  }
}
