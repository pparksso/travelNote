const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const nunjucks = require("nunjucks");

const indexRouter = require("./routes");
const createRouter = require("./routes/create.js");
const updateRouter = require("./routes/update.js");
const userRouter = require("./routes/user.js");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

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

app.listen(PORT, () => {
  console.log(PORT + "포트");
});
