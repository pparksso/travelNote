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
    const commentInsert = commentsDb.create({
      comment: comment,
      contentsNo: contentsNo,
      nickname: nickname,
      id: id,
    });
    res.json({ comment: comment, contentsNo: contentsNo, nickname: nickname, id: id });
  } catch (err) {
    res.redirect("500");
  }
});

module.exports = router;
