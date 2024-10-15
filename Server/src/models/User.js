const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  nickname: {
    type: String,
    required: true,
  },
  githubId: {
    type: String,
    unique: true, // Only GitHub User
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
