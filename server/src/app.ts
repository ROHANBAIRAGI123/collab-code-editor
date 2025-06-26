import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Webhooks } from "./utils/WebHooks";
import bodyParser from "body-parser";
import "@dotenvx/dotenvx/config";

//import routers
import healthCheckRouter from "./routers/healthCheck.routers";
import fileRouter from "./routers/File.routers";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes
app.use("/api/health", healthCheckRouter);
app.use("/api/file", fileRouter);

io.on("connection", (socket) => {
  console.log("a user connected on socket", socket.data);

  socket.on("join-room", async ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // const currentCode = await codeExecution.findOne({ roomId });
    // if (currentCode) {
    //   socket.emit("receive-changes", currentCode.currentCodeContent);
    // }
  });

  socket.on("code-change", async ({ roomId, code }) => {
    socket.to(roomId).emit("receive-changes", code);
    // const currentCode = await codeExecution.findOne({ roomId });
    // if (currentCode) {
    //   currentCode.currentCodeContent = code;
    //   await currentCode.save();
    // } else {
    //   const newCode = new codeExecution({
    //     roomId: roomId,
    //     currentCodeContent: code,
    //   });
    //   await newCode.save();
    // }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected from socket");
  });
});

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    console.log("webhook called");
    Webhooks(req, res);
  }
);

export { httpServer, io };
