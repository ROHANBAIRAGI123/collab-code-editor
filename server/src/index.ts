import { httpServer } from "./app";
// import connectDB from "./db";

const PORT: number = Number(process.env.PORT) || 8001;

// connectDB().then(() => {
httpServer.listen(PORT, () => {
  // LISTEN on httpServer, not app
  console.log(`> Express/Socket.IO Backend Server is running at Port: ${PORT}`);
  console.log(
    `> Your Next.js App (frontend) should be running separately on http://localhost:3000`
  );
});
// });
