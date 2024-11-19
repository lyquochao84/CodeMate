const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    require: true,
    unique: true,
  },
  title: { 
    type: String, 
    required: true 
  },
  users: [
    {
      socketId: String,
      name: String,
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
