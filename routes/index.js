const express = require("express");
const router = express.Router();
const passport = require("../config/passport")(router);
const mongodb = require("../config/mongodb");
const cloudinary = require("../config/cloudinary");

router.get("/", (req, res) => {
  const fMsg = req.flash();
  if (fMsg.error == "존재하지 않는 아이디입니다.") {
    return res.render("index", { idError: true, userInfo: req.user, title: "Welcome" });
  }
  if (fMsg.error == "비밀번호를 확인해주세요") {
    return res.render("index", { pwError: true, userInfo: req.user, title: "Welcome" });
  }
  res.render("index", { userInfo: req.user, title: "Welcome" });
});

module.exports = router;
