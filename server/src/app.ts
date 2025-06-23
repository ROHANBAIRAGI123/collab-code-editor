import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Webhooks } from "./utils/WebHooks";
import bodyParser from "body-parser";

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

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  Webhooks
);

export { httpServer, io };
