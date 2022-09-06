const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const nunjucks = require("nunjucks");
const session = require("express-session");
const passport = require("./config/passport")(app);
const cloudinary = require("./config/cloudinary");

const indexRouter = require("./routes");
const createRouter = require("./routes/create.js");
const updateRouter = require("./routes/update.js");
const userRouter = require("./routes/user.js");
const heartRouter = require("./routes/heart.js");
const commentRouter = require("./routes/comment.js");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("port", process.env.PORT || 8099);
const PORT = app.get("port");

app.use("/", indexRouter);
app.use("/create", createRouter);
app.use("/update", updateRouter);
app.use("/user", userRouter);
app.use("/heart", heartRouter);
app.use("/comment", commentRouter);

// 에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`Not Found`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.error = process.env.NODE_ENV !== "prodection" ? err : {};
  res.status(err.status || 404);
  res.render("404");
});

app.listen(PORT, () => {
  console.log(PORT + "포트");
});
