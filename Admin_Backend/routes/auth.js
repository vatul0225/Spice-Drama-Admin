import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- LOGIN ---------------- */
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

/* ---------------- ME ---------------- */
router.get("/me", protect, (req, res) => {
  res.json({
    user: req.user,
  });
});

/* ---------------- USERS (ADMIN ONLY) ---------------- */
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

router.post("/users", protect, adminOnly, async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashed,
    role,
  });

  res.json({ success: true, user });
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
