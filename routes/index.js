const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoClient = require("mongodb").MongoClient;
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

router.use(flash());
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
