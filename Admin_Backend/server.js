import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

/* ---------------- TRUST PROXY (RENDER FIX) ---------------- */
app.set("trust proxy", 1);

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://spice-drama-admin.vercel.app",
  "https://spice-drama.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server & Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked by CORS:", origin);
      return callback(null, false);
    },
    credentials: true,
  }),
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- SESSION ---------------- */
app.use(
  session({
    name: "admin.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 * 24 * 7, // 7 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);

/* ---------------- HEALTH ---------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "admin-backend" });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Admin backend running on port ${PORT}`));
