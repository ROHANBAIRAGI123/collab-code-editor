import express from "express";
// import cors from "cors";

//import routers
import healthCheckRouter from "./routers/healthCheck.routers";

const app = express();
//:TODO: add cors
// app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes
app.use("/api/health", healthCheckRouter);

app.get("/", (req, res) => {
  console.log(req);
  res.send("API is running...");
});

//error

export { app };
