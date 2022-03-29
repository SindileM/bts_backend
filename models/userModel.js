const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      maxLength: 255,
    },
    profile: {
      type: String,
      required: false,
      maxLength: 1000,
      default:
        "https://i.postimg.cc/VNyjv0h9/User-Profile-PNG-High-Quality-Image.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
