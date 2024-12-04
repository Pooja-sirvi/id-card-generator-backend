const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: passwordHash,
      role: "admin",
    });

    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error during signup" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error during login" });
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

// Get current user
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
