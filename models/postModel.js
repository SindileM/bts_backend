const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    main_image: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: false,
    },
    user_image: {
      type: String,
      required: false,
    },
    comments: {
      type: Array,
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
