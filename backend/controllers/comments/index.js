const moment = require("moment");
const resolve = require("../../utils/promises");
const asyncHandler = require("express-async-handler");
const {
  Comments,
  Users,
  sequelize,
  Sequelize: { Op },
} = require("../../models");

const getComment = async (id) => {
  const [comment, error] = await resolve(
    Comments.findByPk(id, {
      attributes: {
        include: [
          [
            sequelize.fn(
              "COUNT",
              sequelize.col("likes.LikedComments.CommentId")
            ),
            "likeCount",
          ],
        ],
      },
      include: [
        { model: Users, as: "author" },
        { model: Users, as: "likes" },
        {
          model: Comments,
          as: "replies",
          include: [
            { model: Users, as: "author" },
            { model: Users, as: "likes" },
          ],
        },
        {
          model: Comments,
          as: "parent",
          include: [
            { model: Users, as: "author" },
            { model: Users, as: "likes" },
          ],
        },
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
  const { text, parent_id } = req.body;
  const newComment = await Comments.create({ text, time: moment().unix() });
  if (newComment) {
    const randomUser = await getRandommUser();
    await newComment.setAuthor(randomUser.id);
    if (parent_id) {
      await newComment.setParent(parent_id);
    }

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
    where: { parent_id: { [Op.eq]: null } },
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("likes.LikedComments.CommentId")),
          "likeCount",
        ],
      ],
    },
    include: [
      { model: Users, as: "author" },
      {
        model: Users,
        as: "likes",
        duplicating: false,
        required: false,
      },
      {
        model: Comments,
        as: "parent",
        include: [
          { model: Users, as: "author" },
          { model: Users, as: "likes" },
        ],
      },
    ],
    group: ["Comments.id"],
    order: [[sequelize.literal("likeCount"), "desc"]],
  });

  if (comments) {
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comments.findAll({
          where: {
            parent_id: comment.id,
          },
          attributes: {
            include: [
              [
                sequelize.fn(
                  "COUNT",
                  sequelize.col("likes.LikedComments.CommentId")
                ),
                "likeCount",
              ],
            ],
          },
          include: [
            { model: Users, as: "author" },
            { model: Users, as: "likes" },
          ],
          group: ["Comments.id"],
          order: [[sequelize.literal("likeCount"), "desc"]],
        });
        comment.dataValues.replies = replies;
        return comment;
      })
    );
    res.status(200).json(commentsWithReplies);
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
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("likes.LikedComments.CommentId")),
          "likeCount",
        ],
      ],
    },
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
    // await comment.removeLike(user);
  } else {
    await comment.addLike(user);
  }

  await comment.reload({
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("likes.LikedComments.CommentId")),
          "likeCount",
        ],
      ],
    },
    include: [
      { model: Users, as: "author" },
      { model: Users, as: "likes" },
      "replies",
      "parent",
    ],
  });
  res
    .status(200)
    .json({ comment, message: hasLiked ? "liked already" : "liked" });
});

module.exports = {
  addComment,
  getComments,
  getCommentWithId,
  upvoteComment,
};
