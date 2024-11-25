import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with the correct URL

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

export default socket;
