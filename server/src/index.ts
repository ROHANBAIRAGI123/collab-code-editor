import dotenv from "dotenv";
import { app } from "./app";
import connectDB from "./db";
dotenv.config({
  path: "./.env",
});

const PORT: number = Number(process.env.PORT) || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at Port: ${PORT}`);
  });
});
