import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare plain password with hashed password (DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ error: "User is blocked" });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= GET ME ================= */
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

/* ================= CREATE USER (ADMIN ONLY) ================= */
router.post("/users", protect, adminOnly, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (exists) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= LIST USERS (ADMIN) ================= */
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/* ================= DELETE USER (ADMIN) ================= */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
