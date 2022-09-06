const express = require("express");
const router = express.Router();
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");
const commentsDb = require("../db/comments");

router.post("/add", async (req, res) => {
  try {
    const comment = req.body.comment;
    const contentsNo = parseInt(req.body.contentsNo);
    const nickname = req.user.nickname;
    const id = req.user.id;
    const commentCount = await countDb.findByIdAndUpdate({ _id: "6317d07f88627f1738d64f1a" }, { $inc: { count: 1 } }, { new: true });
    const no = await commentCount.count;
    const commentInsert = await commentsDb.create({
      no: no,
      comment: comment,
      contentsNo: contentsNo,
      nickname: nickname,
      id: id,
    });
    res.json({ comment: comment, contentsNo: contentsNo, nickname: nickname, id: id, no: no });
  } catch (err) {
    res.redirect("500");
  }
});

router.post("/delete", async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
