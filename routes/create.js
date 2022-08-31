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
  const title = req.body.title;
  const date = req.body.date;
  const location = req.body.location;
  const desc = req.body.desc;
  const imgUrl = req.body.imgUrl;
  const userNum = req.user.userNum;
  const nickname = req.user.nickname;
  db.collection("count").findOne({ name: "total" }, (err, result) => {
    const no = result.count + 1;
    if (err) {
      res.send(`<script>alret("회원가입에 실패하였습니다. 다시한번 시도해주세요.")</script>`); //500페이지 전송
    }
    db.collection("contents").insertOne(
      {
        no: no,
        userNum: userNum,
        title: title,
        date: date,
        location: location,
        desc: desc,
        imgUrl: imgUrl,
        heart: 0,
        nickname: nickname,
      },
      (err, result) => {
        if (err) {
          //500띄움
        }
        db.collection("count").updateOne(
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
});
module.exports = router;
