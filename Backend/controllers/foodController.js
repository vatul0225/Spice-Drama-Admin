import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ================= CLOUDINARY HELPER ================= */
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: "food-items" },
      (error, result) => {
        if (result?.secure_url) resolve(result.secure_url);
        else reject(error);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

/* ================= ADD FOOD ================= */
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const food = await foodModel.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
    });

    res.json({ success: true, data: food });
  } catch (err) {
    console.error("ADD FOOD ERROR:", err);
    res.status(500).json({ success: false });
  }
};

/* ================= LIST FOOD ================= */
const listFood = async (req, res) => {
  const foods = await foodModel.find({});
  res.json({ success: true, data: foods });
};

/* ================= REMOVE FOOD ================= */
const removeFood = async (req, res) => {
  await foodModel.findByIdAndDelete(req.body.id);
  res.json({ success: true });
};

/* ================= GET SINGLE FOOD ================= */
const getSingleFood = async (req, res) => {
  const food = await foodModel.findById(req.params.id);
  res.json({ success: true, data: food });
};

/* ================= UPDATE FOOD ================= */
const updateFood = async (req, res) => {
  const food = await foodModel.findById(req.params.id);
  if (!food) return res.json({ success: false });

  if (req.file) {
    food.image = await uploadToCloudinary(req.file.buffer);
  }

  food.name = req.body.name ?? food.name;
  food.description = req.body.description ?? food.description;
  food.category = req.body.category ?? food.category;
  food.price = req.body.price ?? food.price;

  await food.save();
  res.json({ success: true });
};

export { addFood, listFood, removeFood, getSingleFood, updateFood };
