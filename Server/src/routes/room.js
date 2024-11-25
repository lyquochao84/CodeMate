const roomController = require("../controllers/roomController");

const express = require("express");
const router = express.Router();

// [POST] Create Room
router.post("/create-room", roomController.createRoom);

// [POST] Join Room 
router.post("/join-room", roomController.joinRoom);

module.exports = router;