const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const { TesseractWorker } = require("tesseract.js");
const worker = new TesseractWorker();

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); //initializing the destination folder for the uploaded image
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // setting up the file name for the uploaded image
  }
});

const upload = multer({ storage: storage }).single("avatar"); // assigning the storage functionality

app.set("view engine", "ejs"); // setting up the engine for EJS

// Routes

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    // reading and analyzimg the uploaded file
    fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
      if (err) return console.log(err);

      worker
        .recognize(data, "eng", { tessjs_create_pdf: "1" }) // analyze the file and send it back generating the pdf
        .progress(progress => {
          console.log(progress); // monitoring the progress
        })
        .then(result => {
          res.redirect("/download");
        })
        .finally(() => worker.terminate()); // Ending worker
    });
  });
});

app.get("/download", (req, res) => {
  const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
  res.download(file);
});

//Start server at PORT 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
