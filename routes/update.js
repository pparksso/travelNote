const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("update", { userInfo: req.user, title: "Update" });
});

module.exports = router;
