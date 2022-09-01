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

router
  .route("/")
  .get((req, res) => {
    if (req.user) {
      db.collection("contents").findOne({ update: true }, (err, result) => {
        if (err) {
          console.log("500던질거임");
        }
        res.render("update", { title: "Update", list: result });
      });
    } else {
      res.send(`<script>alert("시간이 지나 로그인이 해제되었습니다. 다시 로그인 해주세요."); location.href = "/"</script>`);
    }
  })
  .post((req, res) => {
    const no = parseInt(req.body.no);
    db.collection("contents").updateOne(
      { no: no },
      {
        $set: { update: true },
      },
      (err, result) => {
        if (err) {
          console.log("500띄울거임");
        }
        res.json({ isUpdate: true });
      }
    );
  });

router.post("/done", (req, res) => {
  const imgUrl = req.body.imgUrl;
  const date = req.body.date;
  const title = req.body.title;
  const location = req.body.location;
  const desc = req.body.desc;
  db.collection("contents").updateOne(
    { update: true },
    {
      $set: {
        imgUrl: imgUrl,
        date: date,
        title: title,
        location: location,
        desc: desc,
      },
    },
    (err, result) => {
      if (err) {
        console.log("500띄울거임");
      }
      db.collection("contents").updateOne(
        { update: true },
        {
          $unset: {
            update: true,
          },
        },
        (err, result) => {
          if (err) {
            console.log("500띄울거임");
          }
        }
      );
    }
  );
  res.json({ update: true });
});
module.exports = router;
