import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= PROTECT ================= */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT: fetch fresh user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ error: "User is blocked" });
    }

    req.user = user; // FULL USER OBJECT
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* ================= ADMIN ONLY ================= */
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only access" });
  }
  next();
};
