const Room = require("../models/Room");

class roomController {
  // [POST] Save Room Infos
  async createRoom(req, res) {
    const { roomId, title } = req.body;

    try {
      const existingRoom = await Room.findOne({ roomId });
      if (existingRoom) {
        return res.status(400).json({ message: "Room ID already exists!" });
      }

      const newRoom = new Room({ title, roomId, users: [] });
      await newRoom.save();
      return res.status(201).json({ message: "Room created successfully!" });
    } 
    catch (error) {
      console.error(err);
      return res.status(500).json({ message: "Server error!" });
    }
  }
}

module.exports = new roomController();
