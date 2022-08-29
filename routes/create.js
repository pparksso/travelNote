const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const path = require("path");
const passport = require("../config/passport")(router);

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
  console.log(req.user);
  res.render("create", { userInfo: req.user, title: "New" });
});
router.post("/sendimg", cloudinary.fileUpload.single("image"), (req, res) => {
  console.log(req + " req");
  cloudinary.cloudinary.uploader.upload(req.file.path, (result) => {
    res.json({
      cloudinaryImgSrc: result.url,
    });
  });
});
module.exports = router;
