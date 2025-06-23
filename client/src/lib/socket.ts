"use client";
import { io } from "socket.io-client";
export const socket = io("http://localhost:8001");

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log("socket disconnected");
});
