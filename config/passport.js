module.exports = function (router) {
  // const db = require("./mongodb");
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  router.use(flash());

  const MongoClient = require("mongodb").MongoClient;
  let db = null;
  MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.log(err, "db connecting err");
    }
    console.log("====db connect");
    db = client.db("travelApp");
  });

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
    db.collection("user").findOne({ id: id }, (err, result) => {
      done(null, result);
    });
  });
  return passport;
};
