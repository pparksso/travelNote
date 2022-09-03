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

router.get("/arr", (req, res) => {
  db.collection("user").findOne({ userNum: req.user.userNum }, (err, result) => {
    if (err) {
      console.log("500띄울거임");
    }
    res.json({ heartArr: result.heart });
  });
});

router.post("/plus", async (req, res) => {
  const no = parseInt(req.body.no);
  await db.collection("user").updateOne(
    { userNum: req.user.userNum },
    {
      $addToSet: {
        heart: no,
      },
    },
    (err, result) => {
      if (err) {
        console.log("500");
      }
    }
  );
  await db.collection("contents").updateOne({ no: no }, { $inc: { heartNum: 1 } }, (err, result) => {
    if (err) {
      console.log("500");
    }
    db.collection("contents").findOne({ no: no }, (err, result) => {
      if (err) {
        console.log("500");
      }
      res.json({ heartNum: result.heartNum });
    });
  });
});

router.post("/minus", async (req, res) => {
  const no = parseInt(req.body.no);
  await db.collection("user").updateOne(
    { userNum: req.user.userNum },
    {
      $pull: {
        heart: no,
      },
    },
    (err, result) => {
      if (err) {
        console.log("500");
      }
    }
  );
  await db.collection("contents").updateOne({ no: no }, { $inc: { heartNum: -1 } }, (err, result) => {
    if (err) {
      console.log("500띄울거임");
    }
    db.collection("contents").findOne({ no: no }, (err, result) => {
      if (err) {
        console.log("500띄울거임");
      }
      res.json({ heartNum: result.heartNum });
    });
  });
});

module.exports = router;
