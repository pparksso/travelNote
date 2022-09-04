const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const passport = require("../config/passport")(router);
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");

router.get("/", async (req, res) => {
  try {
    const fMsg = req.flash();
    // 페이지네이션
    let page = parseInt(req.query.page);
    const size = 9;
    if (!page) {
      page = 1;
    }
    const skip = (page - 1) * size;
    const contents = await contentsDb.find().sort({ no: -1 }).limit(size).skip(skip);
    const totalContents = await contentsDb.countDocuments({});
    const totalPage = await Math.ceil(totalContents / size);
    if (fMsg.error == "존재하지 않는 아이디입니다.") {
      return res.render("index", { idError: true, page: page, totalPage: totalPage, userInfo: req.user, title: "Welcome", list: contents });
    }
    if (fMsg.error == "비밀번호를 확인해주세요") {
      return res.render("index", { pwError: true, page: page, totalPage: totalPage, userInfo: req.user, title: "Welcome", list: contents });
    }
    res.render("index", { page: page, totalPage: totalPage, userInfo: req.user, title: "Welcome", list: contents });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
