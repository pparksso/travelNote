const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const passport = require("../config/passport")(router);
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "travelDiary",
  },
});

router.get("/", async (req, res) => {
  try {
    const fMsg = req.flash();
    if (fMsg.error == "존재하지 않는 아이디입니다.") {
      return db
        .collection("contents")
        .find()
        .toArray((err, result) => {
          res.render("index", { idError: true, userInfo: req.user, title: "Welcome", list: result });
        });
    }
    if (fMsg.error == "비밀번호를 확인해주세요") {
      return db
        .collection("contents")
        .find()
        .toArray((err, result) => {
          res.render("index", { pwError: true, userInfo: req.user, title: "Welcome", list: result });
        });
    }
    //페이지네이션
    let page = parseInt(req.query.page);
    const size = 9;
    if (!page) {
      page = 1;
    }
    const skip = (page - 1) * size;
    const contents = await contentsDb.find().sort({ no: -1 }).limit(size).skip(skip);
    const totalContents = await contentsDb.countDocuments({});
    const totalPage = await Math.ceil(totalContents / size);
    await res.render("index", { page: page, totalPage: totalPage, userInfo: req.user, title: "Welcome", list: contents });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
