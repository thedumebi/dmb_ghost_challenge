const commentRouter = require("express").Router();

const {
  addComment,
  getComments,
  upvoteComment,
  getCommentWithId,
} = require("../../controllers/comments");

commentRouter.route("/").get(getComments).post(addComment);
commentRouter.route("/:id").get(getCommentWithId).patch(upvoteComment);

module.exports = commentRouter;
