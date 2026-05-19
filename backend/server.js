const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");
const app = express();
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
});

const path = require("path");


app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads")
);

app.get("/menu", (req, res) => {

    const menus = db
        .prepare("SELECT * FROM menus")
        .all();

    res.json(menus);
});
app.post("/menu", (req, res) => {

    const {
        name,
        price,
        image_url,
        category
    } = req.body;

    const stmt = db.prepare(`
        INSERT INTO menus
        (name, price, image_url, category)
        VALUES (?, ?, ?, ?)
    `);

    stmt.run(
        name,
        price,
        image_url,
        category
    );

    res.json({
        message: "menu added"
    });
});
app.delete("/menu/:id", (req, res) => {

    const id = req.params.id;

    const stmt = db.prepare(`
        DELETE FROM menus
        WHERE id = ?
    `);

    stmt.run(id);

    res.json({
        message: "menu deleted"
    });
});
app.put("/menu/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        price,
        category,
        image_url
    } = req.body;

    const stmt = db.prepare(`
    UPDATE menus
    SET
    name = ?,
    price = ?,
    category = ?,
    image_url = ?
    WHERE id = ?
`);

    stmt.run(
        name,
        price,
        category,
        image_url,
        id
    );

    res.json({
        message: "updated"
    });
});
app.post(
  "/upload",
  upload.single("image"),
  (req, res) => {

    res.json({
      imageUrl:
      `http://localhost:5000/uploads/${req.file.filename}`
    });
});
app.listen(5000, () => {
    console.log("server running");
});