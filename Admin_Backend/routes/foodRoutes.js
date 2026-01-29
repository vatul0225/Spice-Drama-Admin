import express from "express";
import multer from "multer";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import {
  addFood,
  listFood,
  removeFood,
  getSingleFood,
  updateFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

/* ================= MULTER (MEMORY STORAGE) ================= */
// ❌ diskStorage REMOVED
// ❌ uploads folder REMOVED
const upload = multer({
  storage: multer.memoryStorage(),
});

/* ================= ROUTES ================= */

// ADD FOOD
foodRouter.post(
  "/add",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  upload.single("image"),
  addFood
);

// LIST FOOD
foodRouter.get("/list", isAuthenticated, listFood);

// REMOVE FOOD
foodRouter.post(
  "/remove",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  removeFood
);

// GET SINGLE FOOD
foodRouter.get("/single/:id", isAuthenticated, getSingleFood);

// UPDATE FOOD
foodRouter.put(
  "/update/:id",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  upload.single("image"),
  updateFood
);

export default foodRouter;
