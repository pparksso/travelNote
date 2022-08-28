const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("create", { userInfo: req.user, title: "New" });
});

module.exports = router;
