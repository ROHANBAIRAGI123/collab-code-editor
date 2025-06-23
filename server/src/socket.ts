import { io } from "./app";
import { codeExecution } from "./models/Connection.model";

io.on("connection", (socket) => {
  console.log("a user connected on socket", socket.data);

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

  socket.on("disconnect", () => {
    console.log("user disconnected from socket");
  });
});
