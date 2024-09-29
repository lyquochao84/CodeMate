const User = require("../models/User");
const db = require("../database/mogodb");
const { hashPassword } = require("../lib/auth");

class authController {
  // Register Account
  async register(req, res) {
    const { email, password, nickname } = req.body;
    const hashedPassword = await hashPassword(password);

    try {
      const newUser = new User({
        email,
        password: hashedPassword,
        nickname,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully!" });
    } 
    catch(error) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Email already exists!" });
      } 
      else {
        res.status(500).json({ message: "Server error", error });
      }
    }
  }
  // Log In
  async logIn(req, res) {

  }
}

module.exports = new authController();
