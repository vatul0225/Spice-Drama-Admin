import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
});

/* ================= GET ME ================= */
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

/* ================= CREATE USER (ADMIN) ================= */
router.post("/users", protect, adminOnly, async (req, res) => {
  const { username, email, password, role } = req.body;

  // ✅ validation
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields required" });
  }

  const exists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exists) {
    return res.status(400).json({
      error: "Username or Email already exists",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashed,
    role,
    isActive: true,
  });

  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

/* ================= LIST USERS ================= */
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

/* ================= DELETE USER ================= */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
