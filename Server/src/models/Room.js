const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: String,
    title: String,
});

const Room = mongoose.model("room", roomSchema);
module.exports = Room;