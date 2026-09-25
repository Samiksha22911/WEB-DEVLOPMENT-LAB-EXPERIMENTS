const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Model } = require("../utils/db");
const { authenticate, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();
const Users = Model("users");

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = Users.all().find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    studentId: user.studentId,
    name: user.name,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });

  res.json({ token, user: payload });
});

// GET /api/auth/me
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
