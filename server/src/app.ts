import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

//import routers
import healthCheckRouter from "./routers/healthCheck.routers";

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

io.on("connection", (socket) => {
  console.log("a user connected on socket", socket.data);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("receive-changes", code);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected from socket");
  });
});

export { httpServer, io };
