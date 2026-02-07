import express from "express";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import {
  listUsers,
  deleteUser,
  getUserDetails,
  banUser,
  unbanUser,
} from "../controllers/adminUserController.js";

const adminUserRouter = express.Router();

// ✅ List all users (ADMIN only)
adminUserRouter.get("/list", isAuthenticated, hasRole("admin"), listUsers);

// ✅ Get single user
adminUserRouter.get(
  "/details/:id",
  isAuthenticated,
  hasRole("admin"),
  getUserDetails,
);

// ✅ Delete user (ADMIN only)
adminUserRouter.delete(
  "/delete/:id",
  isAuthenticated,
  hasRole("admin"),
  deleteUser,
);

// ✅ Ban / Unban (ADMIN only)
adminUserRouter.post("/ban/:id", isAuthenticated, hasRole("admin"), banUser);

adminUserRouter.post(
  "/unban/:id",
  isAuthenticated,
  hasRole("admin"),
  unbanUser,
);

export default adminUserRouter;
