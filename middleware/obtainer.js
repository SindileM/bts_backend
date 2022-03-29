const User = require("../models/userModel");
const Post = require("../models/postModel");

async function obtainPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: "Post not found." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  res.post = post;
  next();
}

async function obtainUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  res.user = user;
  next();
}

module.exports = {
  obtainPost: retrievePost,
  obtainUser: retrieveUser,
};
