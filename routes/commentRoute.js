const router = require("express").Router();
const comment = require("../models/commentModel");
const { retrievePost } = require("../middleware/retriever");
const { retrieveUser } = require("../middleware/retriever");
const verifyAcc = require("../middleware/authJWT");
const dotenv = require("dotenv");
dotenv.config();

//Comment Section

router.get("/:id/comments", [verifyAcc, retrievePost], (req, res) => {
  return res.send(res.post.comments);
});

router.post(
  "/:id/comments/create",
  [verifyAcc, retrievePost, retrieveUser],
  async (req, res) => {
    let userName = res.user.username;
    let userID = res.user._id;
    let newComment = new comment({
      content: req.body.content,
      posted_by: userName,
      userId: userID,
    });
    let comments = res.post.comments;
    let addedToComments = false;
    if (!addedToComments) comments.push(newComment);
    try {
      const updatedPost = res.post.save(comments);
      res.status(200).send({ message: "Comment created" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

router.delete(
  "/:id/comments/delete/:comment_id",
  [verifyAcc, retrievePost, retrieveUser],
  async (req, res) => {
    let storedComments = res.post.comments;
    storedComments.forEach((comment) => {
      if (
        comment._id.toString().replace(/['"]/g, "") == req.params.comment_id
      ) {
        comment.toDelete = true;
      }
    });
    const newComments = storedComments.filter((comment) => !comment.toDelete);
    try {
      // storedComments.forEach((comment) => {
      //   index = comment._id.valueOf();
      //   if (res.user._id.valueOf() !== comment.userId.valueOf()) {
      //     return res
      //       .status(404)
      //       .send({ message: "You cannot delete this comment." });
      //   } else {
      //     console.log("authorized");
      //     if (index !== null) storedComments.splice(index, 1);
      //   }
      // });
      res.post.comments = newComments;
      res.post.markModified("comments");
      const updatedPost = await res.post.save();
      res.status(200).send(updatedPost.comments);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

module.exports = router;
