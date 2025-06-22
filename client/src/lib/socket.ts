"use client";
import { io } from "socket.io-client";
export const socket = io("http://localhost:8001");

socket.on("connect", () => {
  console.log(socket.connected); // true
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});
