const { Server } = require("socket.io");
const ACTIONS = require("../lib/actions");

const usersMap = {};
const codeMap = {};

// Get total users in the room
async function getUsersinRoom(roomId, io) {
  const socketList = await io.in(roomId).allSockets();
  const usersList = [];

  socketList.forEach((user) => {
    if (user in usersMap) {
      usersList.push(usersMap[user].username);
    }
  });

  return usersList;
}

async function updateUserslistAndCodeMap(io, socket, roomId) {
  socket.in(roomId).emit("member-left", {
    username: usersMap[socket.id].username,
  });

  // Update the user list
  delete usersMap[socket.id];
  const userList = await getUsersinRoom(roomId, io);
  socket.in(roomId).emit("updating-user-list", { userList: userList });

  if (userList.length === 0) {
    delete codeMap[roomId];
  }
}

function setupSocketIO(server) {
  // Set up Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Join Room
    socket.on("join-room", async ({ roomId, username }) => {
      console.log("username: ", username);
      usersMap[socket.id] = { username };
      socket.join(roomId);

      const userList = await getUsersinRoom(roomId, io);

      // Update the user list for other users
      socket.in(roomId).emit("updating-user-list", { userList: userList });

      // Update the user list for current user
      io.to(socket.id).emit("updating-user-list", { userList: userList });

      // Send the latest code changes to user when they joined to existing room
      if (roomId in codeMap) {
        io.to(socket.id).emit("change-language", {
          languageUsed: codeMap[roomId].languageUsed,
        });
        io.to(socket.id).emit("change-code", { code: codeMap[roomId].code });
      }

      // Notify other users in the room when the new user joined
      socket.in(roomId).emit("new-user-joined", { username });
    });

    // Updated the language used in the room
    socket.on("update-language", ({ roomId, languageUsed }) => {
      if (roomId in codeMap) {
        codeMap[roomId]["languageUsed"] = languageUsed;
      } 
      else {
        codeMap[roomId] = { languageUsed };
      }
    });

    // Syncing the language
    socket.on("sync-language", ({ roomId }) => {
      if (roomId in codeMap) {
        socket.in(roomId).emit("change-language", {
          languageUsed: codeMap[roomId].languageUsed,
        });
      }
    });

    // Updated the edited code
    socket.on("update-code", ({ roomId, code }) => {
      if (roomId in codeMap) {
        codeMap[roomId]["code"] = code;
      } 
      else {
        codeMap[roomId] = { code };
      }
    });

    // Syncing the code
    socket.on("sync-code", ({ roomId }) => {
      if (roomId in codeMap) {
        socket.in(roomId).emit("change-code", { code: codeMap[roomId].code });
      }
    });

    // Leave Room
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
      updateUserslistAndCodeMap(io, socket, roomId);
    });

    // Disconnect
    socket.on("disconnecting", (reason) => {
      socket.rooms.forEach((eachRoom) => {
        if (eachRoom in codeMap) {
          updateUserslistAndCodeMap(io, socket, eachRoom);
        }
      });
    });

    //Whenever someone disconnects, this piece of code executed
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

module.exports = setupSocketIO;
