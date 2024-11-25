const Room = require("../models/Room");

class roomController {
  // [POST] Create Room
  async createRoom(req, res) {
    const { roomId, title, user } = req.body;

    try {
      // Check if the room already exists
      const existingRoom = await Room.findOne({ roomId });
      if (existingRoom) {
        return res.status(400).json({ message: "Room ID already exists!" });
      }

      // Create a new room
      const newRoom = new Room({
        title,
        roomId,
        users: [user], // Initialize the creator as the first person in the room
      });
      
      // Save to database
      await newRoom.save();

      return res.status(201).json({ message: "Room created successfully!", room: newRoom });
    } 
    catch (error) {
      res.status(500).json({ message: "Failed to create room.", error });
    }
  }

  // [POST] Join Room
  async joinRoom(req, res) {
    const { roomId, user } = req.body;

    try {
      // Check if there is room exist with the ID sent from user
      const room = await Room.findOne({ roomId });
      if (!room) {
        return res.status(404).json({ message: "Room not found!" });
      }

      // Check if the user is already in the room
      if (!room.users.includes(user)) {
        room.users.push(user);
        await room.save();
      }
      
      return res.status(200).json({ message: "Joined room successfully", title: room.title });
    } 
    catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error!" });
    }
  }
}

module.exports = new roomController();
