const { Server } = require("socket.io");
const Room = require("../models/Room");

function setupSocketIO(server) {
  // Set up Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Open new connection
  io.on("connection", (socket) => {
    // The event when the user first created a new room or joined an existing room
    socket.on("joinRoom", async ({ room_id, user }) => {
      try {
        // Find the room in database
        const room = await Room.findOne({ room_id });
        if (!room) {
          return socket.emit("Error", { message: "Room not found." });
        }

        console.log(room);

        // Check if the user is already in the room
        if (!room.users.includes(user)) {
          room.users.push(user);
          await room.save();


          // Notify all clients in the room about the updated users list
          io.to(room_id).emit("updatedUser", { users: room.users });
        }

        // Join the socket.io room
        socket.join(room_id); 
      } 
      catch (error) {
        socket.emit("error", { message: "Failed to join room.", error });
      }
    });
  });
}

module.exports = setupSocketIO;
