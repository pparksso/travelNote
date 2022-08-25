const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const nunjucks = require("nunjucks");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  console.log("db connect");
  if (err) {
    console.log(err, "db connecting err");
  }
  db = client.db("travelApp");
});

app.set("view engine", "njk");
app.set("port", process.env.PORT || 8099);
const PORT = app.get("port");
app.listen(PORT, () => {
  console.log(PORT + "포트");
});
