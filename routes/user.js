const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;
const saltRounds = 10;

let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  console.log("db connect");
  if (err) {
    console.log(err, "db connecting err");
  }
  db = client.db("travelApp");
});

router.post("/join", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const nickname = req.body.nickname;
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
});
router.get("/mypage", (req, res) => {
  res.render("mypage");
});

module.exports = router;
