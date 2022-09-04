module.exports = function (router) {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const mongoose = require("../db/mongoose");
  const userDb = require("../db/user");
  const countDb = require("../db/count");
  const contentsDb = require("../db/contents");
  router.use(flash());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "loginId",
        passwordField: "loginPw",
        session: true,
        passReqToCallback: false,
      },
      (loginId, loginPw, done) => {
        userDb.findOne({ id: loginId }, (err, result) => {
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
    userDb.findOne({ id: id }, (err, result) => {
      done(null, result);
    });
  });
  return passport;
};
