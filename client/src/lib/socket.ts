"use client";
import { io } from "socket.io-client";
export const socket = io(`${process.env.BACKEND_URL}`);

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log("socket disconnected");
});
