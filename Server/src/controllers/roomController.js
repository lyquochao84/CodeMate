const Room = require("../models/Room");

class roomController {
  // [POST] Save a new room infos into database
  async createRoom(req, res) {
    const { roomId, title } = req.body;
    
    try {
      const existingRoom = await Room.findOne({ roomId });
      if (existingRoom) {
        return res.status(400).json({ message: "This room already exists!" });
      }

      const newRoom = new Room({ roomId, title });
      await newRoom.save();

      return res.status(201).json({ message: "Room created successfully!" });
    } 
    catch (error) {
      res.status(500).json({ message: "Failed to create room.", error });
    }
  }

  // [POST] Return the problem title when user request to join the room
  async joinRoom(req, res) {
    const { roomId } = req.body;

    try {
      const existingRoom = await Room.findOne({ roomId });
      if (!existingRoom) {
        return res.status(404).json({ message: "This room does not exist!" });
      }

      return res
        .status(200)
        .json({
          message: "Redirect the user to the existing room!",
          problemTitle: existingRoom.title,
        });
    } 
    catch (error) {
      res
        .status(500)
        .json({ message: "Failed to find an existing room.", error });
    }
  }
}

module.exports = new roomController();
