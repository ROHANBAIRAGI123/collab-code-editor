"use client";
import { io } from "socket.io-client";
console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
export const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log("socket disconnected");
});
