const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  pw: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  userNum: {
    type: Number,
    required: true,
  },
  heart: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model("user", userSchema, "user");
