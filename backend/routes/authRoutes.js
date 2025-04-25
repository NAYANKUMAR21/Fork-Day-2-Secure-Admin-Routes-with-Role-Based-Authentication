const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Issue: Password should be hashed before saving

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashPass, // Not hashed
    });

    await newUser.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  // Issue: No password comparison (should hash password and compare)
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(401).send({ message: "Un-authenticated wrong password" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: true,
  });

  res.json({ token });
});

module.exports = router;
