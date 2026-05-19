const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();

// ======================
// CONFIG
// ======================
const BASE_URL = "https://cafe-admin-3odu.onrender.com";
const PORT = process.env.PORT || 5000;

// ======================
// CREATE uploads folder (IMPORTANT FIX)
// ======================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// serve static images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// MULTER CONFIG
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ======================
// ROOT CHECK
// ======================
app.get("/", (req, res) => {
  res.send("Cafe Admin API is running 🚀");
});

// ======================
// MENU API
// ======================
app.get("/menu", (req, res) => {
  const menus = db.prepare("SELECT * FROM menus").all();
  res.json(menus);
});

app.post("/menu", (req, res) => {
  const { name, price, image_url, category } = req.body;

  db.prepare(`
    INSERT INTO menus (name, price, image_url, category)
    VALUES (?, ?, ?, ?)
  `).run(name, price, image_url, category);

  res.json({ message: "menu added" });
});

app.delete("/menu/:id", (req, res) => {
  const id = req.params.id;

  db.prepare("DELETE FROM menus WHERE id = ?").run(id);

  res.json({ message: "menu deleted" });
});

app.put("/menu/:id", (req, res) => {
  const id = req.params.id;
  const { name, price, category, image_url } = req.body;

  db.prepare(`
    UPDATE menus
    SET name = ?, price = ?, category = ?, image_url = ?
    WHERE id = ?
  `).run(name, price, category, image_url, id);

  res.json({ message: "updated" });
});

// ======================
// UPLOAD (FIXED FOR RENDER)
// ======================
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    imageUrl: `${BASE_URL}/uploads/${req.file.filename}`,
  });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});