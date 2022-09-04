const mongoose = require("mongoose");

const contentsSchema = new mongoose.Schema({
  no: {
    type: Number,
    required: true,
  },
  userNum: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  heartNum: {
    type: Number,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("contents", contentsSchema);
