const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    require: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  users: {
    type: [String],
    default: [], // Initialize as an empty array
  }
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
