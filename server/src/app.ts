import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "@dotenvx/dotenvx/config";

//import routers
import healthCheckRouter from "./routers/healthCheck.routers";
import AIRouter from "./routers/AI.routes";
import connectionRouter from "./routers/connection.routers";
import { codeExecution } from "./models/Connection.model";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes
app.use("/api/health", healthCheckRouter);
app.use("/api/ai", AIRouter);
app.use("/api", connectionRouter);

io.on("connection", (socket) => {
  socket.on("join-room", async ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    const currentCode = await codeExecution.findOne({ roomId });
    if (currentCode) {
      socket.emit("receive-changes", currentCode.currentCodeContent);
    }
  });

  socket.on("code-change", async ({ roomId, code }) => {
    socket.to(roomId).emit("receive-changes", code);
    const currentCode = await codeExecution.findOne({ roomId });
    if (currentCode) {
      currentCode.currentCodeContent = code;
      await currentCode.save();
    } else {
      const newCode = new codeExecution({
        roomId: roomId,
        currentCodeContent: code,
      });
      await newCode.save();
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("user disconnected from socket", reason);
  });
});

export { httpServer, io };
