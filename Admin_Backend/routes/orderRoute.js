import express from "express";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ADMIN ROUTES - For admin panel to manage orders

// List all orders - Any authenticated admin can view
// orderRouter.get("/list", isAuthenticated, listOrders);
orderRouter.get("/list", hasRole("super_admin", "admin"), listOrders);

// Update order status - Only super_admin and admin can update
orderRouter.post("/status", hasRole("super_admin", "admin"), updateStatus);

export default orderRouter;
