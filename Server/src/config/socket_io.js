const { Server } = require("socket.io");
const Actions = require("../lib/actions");
const ACTIONS = require("../lib/actions");

function setupSocketIO(server) {
  // Set up Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const CodeMateAI = "CodeMate_AI";
  const userMap = {};

  const getAllConnectedUsers = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
      (socketId) => {
        return {
          socketId,
          username: userMap[socketId],
        };
      }
    );
  };

  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    // Join Room
    socket.on(ACTIONS.JOIN_ROOM, ({ roomId, userNickname }) => {
      userMap[socket.id] = userNickname;
      socket.join(roomId);
      const users = getAllConnectedUsers(roomId);
      
      // Notify to all the users in the room that the new user just joined
      users.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED_ROOM, {
          users,
          userNickname,
          socketId: socket.id,
        })
      })
    });
  });
}

module.exports = setupSocketIO;
