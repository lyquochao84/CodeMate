import { io } from "socket.io-client";

// Back-end server 
const socket = io("http://localhost:5000"); 

export default socket;