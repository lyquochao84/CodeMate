const { Server } = require("socket.io");
const cors = require("../middlewares/cors");
const socketIOCollaboration = require("../lib/socket_io_collaboration");

function setupSocketIO(server) {
    const io = new Server(server, cors);

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Delegate events to different modules
        socketIOCollaboration(io, socket);
    });
}

module.exports = setupSocketIO;