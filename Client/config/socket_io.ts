// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = `http://${process.env.NEXT_PUBLIC_SERVER_PRODUCTION}/`;

// Initialize Socket.IO client
const socket = io(SOCKET_URL);

export default socket;
