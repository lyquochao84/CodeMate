const roomController = require("../controllers/roomController");

const express = require("express");
const router = express.Router();

// [POST] Create room 
router.post("/create-room", roomController.createRoom);

// [POST] Joined room
router.post("/join-room", roomController.joinRoom);

module.exports = router;