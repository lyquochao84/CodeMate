const { Server } = require("socket.io");
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
        });
      });
    });

    // Sync the code
    socket.on("changes", ({ roomId, code }) => {
      console.log(roomId, code);
      io.to(roomId).emit(ACTIONS.CHANGE_CODE, { code });
    });

    // When new user join the room, all the previous code display on the new user's editor
    // socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    //   io.to(socketId).emit(ACTIONS.CHANGE_CODE, { code });
    // });

    // leave room
    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      // leave all the room
      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.LEAVE_ROOM, {
          socketId: socket.id,
          username: userMap[socket.id],
        });
      });

      delete userMap[socket.id];
      socket.leave();
    });
  });
}

module.exports = setupSocketIO;
