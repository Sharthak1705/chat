import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Maps userId -> socket.id
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // --- AUDIO OR VIDEO CALL: Caller initiates call
  socket.on("call-user", ({ to, from, signalData }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", {
        from,
        signal: signalData,
      });
    }
  });

  // --- Receiver accepts the call
  socket.on("answer-call", ({ to, from, signal }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) {
      io.to(targetSocket).emit("call-accepted", {
        from,
        signal,
      });
    }
  });

  // --- End call event
  socket.on("end-call", ({ to }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) {
      io.to(targetSocket).emit("call-ended");
    }
  });

  // --- Disconnect
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
