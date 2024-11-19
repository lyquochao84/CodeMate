const roomController = require("../controllers/roomController");

const express = require("express");
const router = express.Router();

// [POST] Save room information
router.post("/create-room", roomController.createRoom);

module.exports = router;