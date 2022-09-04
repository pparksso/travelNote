const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "travelApp",
    format: (req, file) => "jpeg",
  },
});
const fileUpload = multer({ storage: storage });

router
  .route("/")
  .get((req, res) => {
    if (req.user) {
      contentsDb.findOne({ update: true }, (err, result) => {
        if (err) {
          console.log("500던질거임");
        }
        res.render("update", { title: "Update", list: result });
      });
    } else {
      res.send(`<script>alert("시간이 지나 로그인이 해제되었습니다. 다시 로그인 해주세요."); location.href = "/"</script>`);
    }
  })
  .post((req, res) => {
    const no = parseInt(req.body.no);
    contentsDb.updateOne(
      { no: no },
      {
        $set: { update: true },
      },
      (err, result) => {
        if (err) {
          console.log("500띄울거임");
        }
        res.json({ isUpdate: true });
      }
    );
  });

router.post("/done", async (req, res) => {
  try {
    const imgUrl = req.body.imgUrl;
    const date = req.body.date;
    const title = req.body.title;
    const location = req.body.location;
    const desc = req.body.desc;
    const fileName = req.body.fileName;
    await contentsDb.updateOne(
      { update: true },
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
    await contentsDb.updateOne(
      { update: true },
      {
        $unset: {
          update: true,
        },
      }
    );
    res.json({ update: true });
  } catch (err) {
    console.log(err);
  }
});

router.post("/sendimg", fileUpload.single("updateImage"), (req, res) => {
  // cloudinary.uploader.destroy(req.deleteFileName);
  res.json({
    cloudinaryImgSrc: req.file.path,
    cloudinaryFileName: req.file.filename,
  });
});

router.get("/cancle", (req, res) => {
  contentsDb.updateOne({ update: true }, { $unset: { update: true } }, (err, result) => {
    if (err) {
      console.log("500띄울거임");
    }
    res.json({ cancle: true });
  });
});

router.post("/delete", async (req, res) => {
  try {
    const no = parseInt(req.body.no);
    await contentsDb.findOne({ no: no }, (err, result) => {
      cloudinary.uploader.destroy(result.fileName);
    });
    await contentsDb.deleteOne({ no: no }, (err, result) => {
      res.json({ delete: true });
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
