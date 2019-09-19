const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const { TesseractWorker } = require("tesseract.js");
const worker = new TesseractWorker();

// Storage
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, res, cb) => {
    cb(null, req.file);
  }
});

const upload = multer({ storage: storage }).single("avatar");

app.set("view engine", "ejs");

//Start server at PORT 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
