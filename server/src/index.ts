import { httpServer } from "./app";
import connectDB from "./db";

const PORT: number = Number(process.env.PORT);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
