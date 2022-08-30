const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const passport = require("../config/passport")(router);
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({});
const fileUpload = multer({ storage: storage });

const MongoClient = require("mongodb").MongoClient;
let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err, "db connecting err");
  }
  console.log("====db connect");
  db = client.db("travelApp");
});

router.get("/", (req, res) => {
  res.render("create", { userInfo: req.user, title: "New" });
});

router.post("/sendimg", fileUpload.single("image"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (result) => {
    res.json({
      cloudinaryImgSrc: result.url,
    });
  });
});

router.post("/new", fileUpload.single("image"), (req, res) => {
  console.log(req.body);
});
module.exports = router;
