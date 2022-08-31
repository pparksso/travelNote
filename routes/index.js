const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const passport = require("../config/passport")(router);
const cloudinary = require("../config/cloudinary");
// const db = require("../config/mongodb");

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
  const fMsg = req.flash();
  if (fMsg.error == "존재하지 않는 아이디입니다.") {
    return res.render("index", { idError: true, userInfo: req.user, title: "Welcome" });
  }
  if (fMsg.error == "비밀번호를 확인해주세요") {
    return res.render("index", { pwError: true, userInfo: req.user, title: "Welcome" });
  }
  db.collection("contents")
    .find()
    .toArray((err, result) => {
      res.render("index", { userInfo: req.user, title: "Welcome", list: result });
    });
});

module.exports = router;
