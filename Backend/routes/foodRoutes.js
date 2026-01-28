import express from "express";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import upload from "../middlewares/upload.js"; // 🔥 Cloudinary + Multer
import {
  addFood,
  listFood,
  removeFood,
  getSingleFood,
  updateFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

/* ---------------- ROUTES ---------------- */

// ADD FOOD (admin & super_admin)
foodRouter.post(
  "/add",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  upload.single("image"), // 🔥 Cloudinary upload
  addFood,
);

// LIST FOOD
foodRouter.get("/list", isAuthenticated, listFood);

// REMOVE FOOD
foodRouter.post(
  "/remove",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  removeFood,
);

// GET SINGLE FOOD (edit mode)
foodRouter.get("/single/:id", isAuthenticated, getSingleFood);

// UPDATE FOOD
foodRouter.put(
  "/update/:id",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  upload.single("image"), // 🔥 Cloudinary upload
  updateFood,
);

export default foodRouter;
