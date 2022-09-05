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
    const size = 1;
    const pageGroupSize = 5;
    if (!page) {
      page = 1;
    }
    const skip = (page - 1) * size;
    const contents = await contentsDb.find().sort({ no: -1 }).limit(size).skip(skip);
    const totalContents = await contentsDb.countDocuments({});
    const totalPage = await Math.ceil(totalContents / size);
    const startPage = page - ((page - 1) % pageGroupSize);
    const lastPage = startPage + (pageGroupSize - 1);
    const minPage = totalPage <= lastPage ? totalPage : lastPage;
    if (fMsg.error == "존재하지 않는 아이디입니다.") {
      return res.render("index", { idError: true, page: page, totalPage: totalPage, userInfo: req.user, title: "Welcome back!", list: contents });
    }
    if (fMsg.error == "비밀번호를 확인해주세요") {
      return res.render("index", { pwError: true, page: page, totalPage: totalPage, userInfo: req.user, title: "Welcome back!", list: contents });
    }
    if (page > totalPage) {
      return res.redirect("/");
    }
    res.render("index", { startPage: startPage, minPage: minPage, totalPage: totalPage, page: page, userInfo: req.user, title: "Welcome back!", list: contents });
  } catch (err) {
    res.redirect("500");
  }
});

router.get("/500", (req, res) => {
  res.status(500).render("500");
});

module.exports = router;
