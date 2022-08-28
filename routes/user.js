const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");

let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  console.log("db connect");
  if (err) {
    console.log(err, "db connecting err");
  }
  db = client.db("travelApp");
});

router.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false,
    },
  })
);
router.use(flash());
router.use(passport.initialize());
router.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "loginId",
      passwordField: "loginPw",
      session: true,
      passReqToCallback: false,
    },
    (loginId, loginPw, done) => {
      db.collection("user").findOne({ id: loginId }, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false, { message: "존재하지 않는 아이디입니다." });
        if (result) {
          bcrypt.compare(loginPw, result.pw, (err, same) => {
            if (same) {
              return done(null, result, { message: "로그인되었습니다." });
            } else {
              return done(null, false, { message: "비밀번호를 확인해주세요" });
            }
          });
        }
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log(done);
  db.collection("user").findOne({ id: id }, (err, result) => {
    done(null, result);
  });
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
router.get("/mypage", (req, res) => {
  console.log(req.user);
  res.render("mypage", { userInfo: req.user, title: "My page" });
});

module.exports = router;
