const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// static folder สำหรับรูป
app.use("/uploads", express.static("uploads"));

// ======================
// Upload config
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
// ROOT (แก้ Cannot GET /)
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

  const stmt = db.prepare(`
    INSERT INTO menus (name, price, image_url, category)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(name, price, image_url, category);

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
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";

  res.json({
    imageUrl: `${baseUrl}/uploads/${req.file.filename}`,
  });
});

// ======================
// START SERVER
// ======================
app.listen(5000, () => {
  console.log("server running on port 5000");
});