const express = require("express");
const router = express.Router();
const passport = require("../config/passport")(router);
const path = require("path");
const { cloudinary } = require("../config/cloudinary");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");

const fileUpload = multer({ storage: storage });

router.get("/", (req, res) => {
  if (req.user) {
    res.render("create", { title: "New" });
  } else {
    res.send(`<script>alert("시간이 지나 로그인이 해제되었습니다. 다시 로그인 해주세요."); location.href = "/"</script>`);
  }
});

router.post("/sendimg", fileUpload.single("image"), (req, res) => {
  res.json({
    cloudinaryImgSrc: req.file.path,
    cloudinaryFileName: req.file.filename,
  });
});

router.post("/new", fileUpload.single("image"), async (req, res) => {
  if (req.user) {
    const title = req.body.title;
    const date = req.body.date;
    const location = req.body.location;
    const desc = req.body.desc;
    const imgUrl = req.body.imgUrl;
    const userNum = req.user.userNum;
    const nickname = req.user.nickname;
    const fileName = req.body.fileName;
    countDb.findOne({ name: "total" }, (err, result) => {
      const no = result.count + 1;
      if (err) {
        console.log("500띄울꺼임");
      }
      contentsDb.create(
        {
          no: no,
          userNum: userNum,
          title: title,
          date: date,
          location: location,
          desc: desc,
          imgUrl: imgUrl,
          heartNum: 0,
          nickname: nickname,
          fileName: fileName,
        },
        (err, result) => {
          if (err) {
            //500띄움
          }
          countDb.updateOne(
            { name: "total" },
            {
              $inc: {
                count: 1,
              },
            },
            (err, result) => {
              if (err) {
                //500
              }
            }
          );
        }
      );
      res.json({ isCreate: true });
    });
  } else {
    res.send(`<script>alert("시간이 지나 로그인이 해제되었습니다. 다시 로그인 해주세요."); location.href = "/"</script>`);
  }
});
module.exports = router;
