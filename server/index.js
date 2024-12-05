import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { TimerManager } from "./utils/timerManager.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:5173",
    // origin: "http://172.20.10.4:5173",
    origin: "http://10.44.22.59:5173",

    methods: ["GET", "POST"],
  },
});

const users = new Map();
let timerManager;

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  if (!timerManager) {
    timerManager = new TimerManager(io, users);
  }

  socket.on("join", ({ nickname }) => {
    console.log("User joined:", nickname);
    users.set(socket.id, nickname);
    io.emit("userList", Array.from(users.values()));

    if (users.size === 1) {
      timerManager.currentSpeaker = socket.id;
      timerManager.startTimer();
    }

    timerManager.broadcastCurrentSpeaker();
  });

  socket.on("message", (message) => {
    const nickname = users.get(socket.id);
    if (!nickname) return;

    if (
      timerManager.isSpeakerTime &&
      socket.id !== timerManager.currentSpeaker
    ) {
      socket.emit("error", {
        message:
          "Only the current speaker can send messages during speaker time",
      });
      return;
    }

    const messageObj = {
      user: nickname,
      text: message,
      timestamp: new Date().toISOString(),
    };
    console.log("New message:", messageObj);
    io.emit("message", messageObj);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    const wasCurrentSpeaker = timerManager.currentSpeaker === socket.id;
    users.delete(socket.id);
    io.emit("userList", Array.from(users.values()));

    if (wasCurrentSpeaker) {
      timerManager.currentSpeaker = timerManager.nextSpeaker();
      timerManager.broadcastCurrentSpeaker();
    }

    if (users.size === 0) {
      timerManager.stopTimer();
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
