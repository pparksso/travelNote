const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;
let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err, "db connecting err");
  }
  console.log("====db connect");
  db = client.db("travelApp");
});

router.get("/", (req, res) => {
  res.render("create", { userInfo: req.user, title: "New" });
});

module.exports = router;
