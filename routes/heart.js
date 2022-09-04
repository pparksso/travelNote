const express = require("express");
const router = express.Router();
const mongoose = require("../db/mongoose");
const userDb = require("../db/user");
const countDb = require("../db/count");
const contentsDb = require("../db/contents");

router.get("/arr", (req, res) => {
  userDb.findOne({ userNum: req.user.userNum }, (err, result) => {
    if (err) {
      console.log("500띄울거임");
    }
    res.json({ heartArr: result.heart });
  });
});

router.post("/plus", async (req, res) => {
  try {
    const no = parseInt(req.body.no);
    await userDb.updateOne(
      { userNum: req.user.userNum },
      {
        $addToSet: {
          heart: no,
        },
      }
    );
    await contentsDb.updateOne({ no: no }, { $inc: { heartNum: 1 } });
    await contentsDb.findOne({ no: no }, (err, result) => {
      res.json({ heartNum: result.heartNum });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/minus", async (req, res) => {
  try {
    const no = parseInt(req.body.no);
    await userDb.updateOne(
      { userNum: req.user.userNum },
      {
        $pull: {
          heart: no,
        },
      }
    );
    await contentsDb.updateOne({ no: no }, { $inc: { heartNum: -1 } });
    await contentsDb.findOne({ no: no }, (err, result) => {
      res.json({ heartNum: result.heartNum });
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
