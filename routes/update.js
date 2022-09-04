const express = require("express");
const router = express.Router();
const { cloudinary } = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { storage } = require("../config/cloudinary");
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");

const fileUpload = multer({ storage: storage });

router.get("/", (req, res) => {
  const editNum = parseInt(req.query.edit);
  if (req.user) {
    contentsDb.findOne({ no: editNum }, (err, result) => {
      if (err) {
        res.redirect("500");
      }
      res.render("update", { title: "Update", list: result });
    });
  } else {
    res.send(`<script>alert("시간이 지나 로그인이 해제되었습니다. 다시 로그인 해주세요."); location.href = "/"</script>`);
  }
});

router.post("/done", async (req, res) => {
  try {
    const imgUrl = req.body.imgUrl;
    const date = req.body.date;
    const title = req.body.title;
    const location = req.body.location;
    const desc = req.body.desc;
    const fileName = req.body.fileName;
    const no = parseInt(req.body.no);
    await contentsDb.updateOne(
      { no: no },
      {
        $set: {
          imgUrl: imgUrl,
          date: date,
          title: title,
          location: location,
          desc: desc,
          fileName: fileName,
        },
      }
    );
    res.json({ update: true });
  } catch (err) {
    res.redirect("500");
  }
});

router.post("/sendimg", fileUpload.single("updateImage"), (req, res) => {
  // cloudinary.uploader.destroy(req.deleteFileName);
  res.json({
    cloudinaryImgSrc: req.file.path,
    cloudinaryFileName: req.file.filename,
  });
});

router.post("/delete", async (req, res) => {
  try {
    const no = parseInt(req.body.no);
    const result = await contentsDb.findOne({ no: no });
    await cloudinary.uploader.destroy(result.fileName);
    await contentsDb.deleteOne({ no: no });
    res.json({ delete: true });
  } catch (err) {
    res.redirect("500");
  }
});
module.exports = router;
