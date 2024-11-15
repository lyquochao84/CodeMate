const { Server } = require("socket.io");

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Listen for room joining
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room ${roomId}`);
      io.to(roomId).emit(
        "userJoined",
        `User ${socket.id} joined room ${roomId}`
      );
    });

    // Handle code updates
    socket.on("codeUpdate", (data) => {
      const { roomId, code } = data;
      socket.to(roomId).emit("receiveCodeUpdate", code); // Broadcast to others in the room
    });

    // Client disconencted from WebSocket
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = setupSocketIO;
