// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// Initialize Socket.IO client
const socket = io(SOCKET_URL);

export default socket;
