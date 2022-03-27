import * as Types from "./types";

export const setComments = (payload) => ({
  type: Types.SET_COMMENTS,
  payload,
});

export const addComment = (payload) => ({
  type: Types.ADD_COMMENT,
  payload,
});

export const likeComment = (payload) => ({
  type: Types.LIKE_COMMENT,
  payload,
});

export const addReply = (payload) => ({
  type: Types.ADD_COMMENT_REPLY,
  payload,
});
