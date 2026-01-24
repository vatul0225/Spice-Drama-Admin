import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 4000;

/* ---------------- CORS CONFIG (IMPORTANT) ---------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://spice-drama-admin.vercel.app",
      "https://spice-drama.vercel.app",
    ],
    credentials: true,
  }),
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- DB CONNECTION ---------------- */
connectDB();

/* ---------------- STATIC FILES ---------------- */
app.use("/images", express.static("uploads"));

/* ---------------- ROUTES ---------------- */
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
