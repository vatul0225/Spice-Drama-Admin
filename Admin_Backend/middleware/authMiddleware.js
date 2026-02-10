import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= PROTECT MIDDLEWARE ================= */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ error: "Account is blocked" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* ================= ADMIN ONLY ================= */
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};

/* ================= EDITOR OR ADMIN ================= */
export const editorOrAdmin = (req, res, next) => {
  if (!["editor", "admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Editor or Admin access only" });
  }
  next();
};