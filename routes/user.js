const express = require("express");
const router = express.Router();
// const mongodb = require("../config/mongodb");
// const db = require("../config/mongodb");
const passport = require("../config/passport")(router);

const MongoClient = require("mongodb").MongoClient;
let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err, "db connecting err");
  }
  console.log("db connect");
  db = client.db("travelApp");
  return db;
});

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
      db.collection("count").findOne({ name: "user" }, (err, result) => {
        const userNum = result.count + 1;
        if (err) {
          console.log(err, "user count find err");
          res.send(`<script>alret("회원가입에 실패하였습니다. 다시한번 시도해주세요.")</script>`);
        }
        db.collection("user").insertOne(
          {
            userNum: userNum,
            id: id,
            pw: hash,
            nickname: nickname,
          },
          (err, result) => {
            if (err) {
              console.log(err, "user info insert err");
              res.send(`<script>alret("회원가입에 실패하였습니다. 다시한번 시도해주세요.")</script>`);
            }
            db.collection("count").updateOne(
              { name: "user" },
              {
                $inc: {
                  count: 1,
                },
              },
              (err, result) => {
                if (err) {
                  console.log(err, "user count update err");
                  res.send(`<script>alret("회원가입에 실패하였습니다. 다시한번 시도해주세요.")</script>`);
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
  db.collection("user").findOne({ id: id }, (err, result) => {
    if (err) {
      res.send(`<script>alret("id체크에 실패했습니다. 다시 한번 시도해주세요.")</script>`);
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
  db.collection("user").findOne({ nickname: nickname }, (err, result) => {
    if (err) {
      res.send(`<script>alret("닉네임체크에 실패했습니다. 다시 한번 시도해주세요.")</script>`);
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
    res.send(`<script>alert("로그아웃 되었습니다"); location.href= "/"</script>`);
  }
});
router.get("/mytour", (req, res) => {
  db.collection("contents")
    .find({ userNum: req.user.userNum })
    .toArray((err, result) => {
      res.json({ result });
    });
});
router.get("/mypage", (req, res) => {
  res.render("mypage", { userInfo: req.user, title: "My page" });
});

router.post("/sendimg", (req, res) => {});
module.exports = router;
