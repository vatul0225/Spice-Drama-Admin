import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LOGIN (ALL ROLES) ================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if active
    if (!user.isActive) {
      return res.status(403).json({ error: "Account blocked" });
    }

    // Verify password using the model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= GET CURRENT USER ================= */
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
    },
  });
});

/* ================= CREATE USER (ADMIN ONLY) ================= */
router.post("/users", protect, adminOnly, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (!["viewer", "editor", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const exists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (exists) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password, // Will be hashed by pre-save hook
      role,
      isActive: true,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= LIST USERS (ADMIN ONLY) ================= */
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= UPDATE USER (ADMIN ONLY) ================= */
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role && ["viewer", "editor", "admin"].includes(role)) user.role = role;
    if (typeof isActive === "boolean") user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= DELETE USER (ADMIN ONLY) ================= */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= CHANGE PASSWORD ================= */
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password incorrect" });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;