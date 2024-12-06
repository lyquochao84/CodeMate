const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../lib/auth");

// Load .env file
const dotenv = require("dotenv");
dotenv.config();

class authController {
  // [POST] Register Account
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

  // [POST] Log In
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
        process.env.NEXT_PUBLIC_JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Keep it simple for class scope
      res.cookie("token", token, {
        httpOnly: false, // Set it to true if we want prevents access to the cookie via JavaScript
        secure: false, // Set true in production (HTTPS)
        maxAge: 3600000, // Token expires in 1 houre
        sameSite: "strict", // Protects against CSRF attacks
        path: "/",
      });

      res.status(200).json({ message: "Log in successful!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // [GET] User's Data
  async getUserData(req, res) {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(403).json({ message: "No token provided." });
      }

      const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      const user = await User.findById(decodedToken.id).select(
        "nickname email"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ nickname: user.nickname });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  // [GET] GitHub Auth Route
  githubAuth(req, res, next) {
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
  }

  // [GET] GitHub Auth Callback
  githubCallback(req, res, next) {
    passport.authenticate(
      "github",
      { failureRedirect: `${process.env.NEXT_PUBLIC_CLIENT_PRODUCTION}/log-in` },
      (error, user, info) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return res.redirect(`${process.env.NEXT_PUBLIC_CLIENT_PRODUCTION}/log-in`);
        }

        try {
          // Generate JWT token
          const token = jwt.sign(
            { id: user._id, githubId: user.githubId, email: user.email },
            process.env.NEXT_PUBLIC_JWT_SECRET,
            { expiresIn: "1h" }
          );

          // Keep it simple for class scope
          res.cookie("token", token, {
            httpOnly: false, // Set it to true if we want prevents access to the cookie via JavaScript
            secure: false, // Set true in production (HTTPS)
            maxAge: 3600000, // Token expires in 1 houre
            sameSite: "strict", // Protects against CSRF attacks
            path: "/",
          });

          // Redirect to the client-side dashboard after successful authentication
          res.redirect(`${process.env.NEXT_PUBLIC_CLIENT_PRODUCTION}/dashboard`);
        } 
        catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
}

module.exports = new authController();
