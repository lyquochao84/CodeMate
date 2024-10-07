const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../lib/auth");

// Load .env file
const dotenv = require("dotenv");
dotenv.config();

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
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Email already exists!" });
      } else {
        res.status(500).json({ message: "Server error", error });
      }
    }
  }

  // Log In
  async logIn(req, res) {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // User not found
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      // Compare passwords
      const isMatchPassword = await verifyPassword(password, user.password);

      if (!isMatchPassword) {
        return res.status(404).json({ message: "Invalid credentials!" });
      }

      // Create JWT Token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Send token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevents access to the cookie via JavaScript
        secure: process.env.NODE_ENV === "production", // Set true in production (HTTPS)
        maxAge: 3600000, // Token expires in 1 houre
        sameSite: "strict", // Protects against CSRF attacks
      });

      res.status(200).json({ message: "Log in successful!" });
    } 
    catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
}

module.exports = new authController();
