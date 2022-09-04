const express = require("express");
const router = express.Router();
const passport = require("../config/passport")(router);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");

router.post("/join", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const nickname = req.body.nickname;
  const pwCheck = req.body.pwCheck;
  if (pw !== pwCheck) {
    res.json({ pwCheck: false });
  }
  if (pw === pwCheck) {
    bcrypt.hash(pw, saltRounds, (err, hash) => {
      countDb.findOne({ name: "user" }, (err, result) => {
        const userNum = result.count + 1;
        if (err) {
          // res.send(`<script>alret("회원가입에 실패하였습니다. 다시한번 시도해주세요.")</script>`);
          res.redirect("500");
        }
        userDb.create(
          {
            userNum: userNum,
            id: id,
            pw: hash,
            nickname: nickname,
            heart: [],
          },
          (err, result) => {
            if (err) {
              // res.send(`<script>alret("회원가입에 실패하였습니다. 다시한번 시도해주세요.")</script>`);
              res.redirect("500");
            }
            countDb.updateOne(
              { name: "user" },
              {
                $inc: {
                  count: 1,
                },
              },
              (err, result) => {
                if (err) {
                  // res.send(`<script>alret("회원가입에 실패하였습니다. 다시한번 시도해주세요.")</script>`);
                  res.redirect("500");
                }
              }
            );
          }
        );
        res.json({ isjoin: true });
      });
    });
  }
});

router.post("/idcheck", (req, res) => {
  const id = req.body.id;
  userDb.findOne({ id: id }, (err, result) => {
    if (err) {
      // res.send(`<script>alret("id체크에 실패했습니다. 다시 한번 시도해주세요.")</script>`);
      res.redirect("500");
    }
    if (!result) {
      res.json({ idCheck: true });
    } else {
      res.json({ idChech: false });
    }
  });
});
router.post("/nicknamecheck", (req, res) => {
  const nickname = req.body.nickname;
  userDb.findOne({ nickname: nickname }, (err, result) => {
    if (err) {
      // res.send(`<script>alret("닉네임체크에 실패했습니다. 다시 한번 시도해주세요.")</script>`);
      res.redirect("500");
    }
    if (!result) {
      res.json({ isNicknameCheck: true });
    } else {
      res.json({ isNicknameCheck: false });
    }
  });
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
    successRedirect: "/",
  })
);
router.get("/logout", (req, res) => {
  if (req.user) {
    req.session.destroy();
    res.send(`<script>alert("로그아웃 되었습니다."); location.href= "/"</script>`);
  }
});

router.get("/mytour", async (req, res) => {
  try {
    if (req.user) {
      let page = parseInt(req.query.page);
      const size = 8;
      if (!page) {
        page = 1;
      }
      const skip = (page - 1) * size;
      const contents = await contentsDb.find({ userNum: req.user.userNum }).sort({ no: -1 }).limit(size).skip(skip);
      const totalContents = await contentsDb.countDocuments({ userNum: req.user.userNum });
      const totalPage = await Math.ceil(totalContents / size);
      await res.render("mytour", { page: page, totalPage: totalPage, userInfo: req.user, title: "My tour", list: contents });
    } else {
      res.send(`<script>alert("시간이 지나 로그인이 해제되었습니다. 다시 로그인 해주세요."); location.href = "/"</script>`);
    }
  } catch (err) {
    res.redirect("500");
  }
});
router.get("/mypage", (req, res) => {
  if (req.user) {
    res.render("mypage", { title: "My page", list: req.user });
  } else {
    res.send(`<script>alert("시간이 지나 로그인이 해제되었습니다. 다시 로그인 해주세요."); location.href = "/"</script>`);
  }
});

router.post("/mypageupdate", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const nickname = req.body.nickname;
  bcrypt.hash(pw, saltRounds, (err, hash) => {
    userDb.updateOne({ id: id }, { $set: { id: id, pw: hash, nickname: nickname } }, (err, result) => {
      res.json({ infoChange: true });
      if (err) {
        res.redirect("500");
      }
    });
  });
});

router.post("/signout", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  bcrypt.compare(pw, req.user.pw, (err, same) => {
    if (same) {
      contentsDb
        .deleteMany({ userNum: req.user.userNum })
        .then(() => {
          userDb.deleteOne({ id: id }).then(() => {
            res.json({ delete: true });
          });
        })
        .catch((err) => {
          res.redirect("500");
        });
    } else {
      res.json({ isPw: true });
    }
  });
});
module.exports = router;
