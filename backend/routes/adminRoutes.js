const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin protected route
router.get("/", verifyToken, isAdmin, (req, res) => {
  // Issue: The route doesn't check if the user is authorized
  res.send("Welcome to the Admin Panel");
});

module.exports = router;
