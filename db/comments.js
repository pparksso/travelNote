const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  contentsNo: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  no: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("comments", commentsSchema, "comments");
