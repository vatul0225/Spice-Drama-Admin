import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

/* =====================================================
   TRUST PROXY (RENDER REQUIRED)
===================================================== */
app.set("trust proxy", 1);

/* =====================================================
   DATABASE
===================================================== */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* =====================================================
   CORS (🔥 STATIC ORIGIN – COOKIE SAFE)
===================================================== */
app.use(
  cors({
    origin: "https://spice-drama-admin.vercel.app", // 🔥 EXACT frontend URL
    credentials: true,
  }),
);

/* =====================================================
   MIDDLEWARE
===================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   SESSION CONFIG (🔥 RENDER + VERCEL SAFE)
===================================================== */
app.use(
  session({
    name: "admin.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // 🔥 REQUIRED for Render
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 * 24 * 7, // 7 days
    }),
    cookie: {
      httpOnly: true,
      secure: true, // 🔥 HTTPS only
      sameSite: "none", // 🔥 Cross-site cookie
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

/* =====================================================
   ROUTES
===================================================== */
app.use("/api/auth", authRoutes);

/* =====================================================
   HEALTH CHECK
===================================================== */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "admin-backend" });
});

/* =====================================================
   SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Admin backend running on port ${PORT}`));
