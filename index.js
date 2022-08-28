const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const nunjucks = require("nunjucks");
const session = require("express-session");
const passport = require("./config/passport")(app);
// const db = require("./config/mongodb");
const cloudinary = require("./config/cloudinary");

const MongoClient = require("mongodb").MongoClient;
let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err, "db connecting err");
  }
  console.log("db connect");
  db = client.db("travelApp");
});

const indexRouter = require("./routes");
const createRouter = require("./routes/create.js");
const updateRouter = require("./routes/update.js");
const userRouter = require("./routes/user.js");

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
      maxAge: 1000 * 60 * 60,
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

app.listen(PORT, () => {
  console.log(PORT + "포트");
});
