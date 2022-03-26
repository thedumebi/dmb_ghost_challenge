const resolve = require("../../utils/promises");
const asyncHandler = require("express-async-handler");
const { Comments, Users, sequelize } = require("../../models");

const getComment = async (id) => {
  const [comment, error] = await resolve(
    Comments.findByPk(id, {
      include: [
        { model: Users, as: "author" },
        { model: Users, as: "likes" },
        "replies",
        "parent",
      ],
    })
  );
  if (error) throw error;

  return comment;
};

const getRandommUser = async () => {
  const [user, error] = await resolve(
    Users.findOne({
      order: sequelize.random(),
    })
  );
  if (error) throw error;

  return user;
};

/**
 * route POST /comments
 * description add a new comment
 * access all
 */
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const newComment = await Comments.create({ text });
  if (newComment) {
    const randomUser = await getRandommUser();
    await newComment.setAuthor(randomUser.id);

    const comment = await getComment(newComment.id);
    res.status(200).json(comment);
  } else {
    res.status(500);
    throw new Error("Could not add new comment");
  }
});

/**
 * route GET /comments
 * description get all comment
 * access all
 */
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comments.findAll({
    include: [
      { model: Users, as: "author" },
      { model: Users, as: "likes" },
      "replies",
      "parent",
    ],
  });

  if (comments) {
    res.status(200).json(comments);
  } else {
    res.status(500);
    throw new Error("Could not get comments");
  }
});

/**
 * route GET /comments/:id
 * description get a comment with it's id
 * access all
 */
const getCommentWithId = asyncHandler(async (req, res) => {
  const comment = await getComment(req.params.id);
  if (comment) {
    res.status(200).json(comment);
  } else {
    res.status(404);
    throw new Error("Could not get comment");
  }
});

/**
 * route PATCH /comments
 * description upvote a comment
 * access all
 */
const upvoteComment = asyncHandler(async (req, res) => {
  const comment = await Comments.findByPk(req.params.id, {
    include: [
      { model: Users, as: "author" },
      { model: Users, as: "likes" },
      "replies",
      "parent",
    ],
  });
  if (!comment) {
    res.status(400);
    throw new Error("Could not upvote comment");
  }

  const user = await getRandommUser();
  const hasLiked = await comment.hasLike(user);
  if (hasLiked) {
    await comment.removeLike(user);
  } else {
    await comment.addLike(user);
  }

  await comment.reload();
  res.status(200).json({ comment, message: hasLiked ? "unliked" : "liked" });
});

module.exports = {
  addComment,
  getComments,
  getCommentWithId,
  upvoteComment,
};
