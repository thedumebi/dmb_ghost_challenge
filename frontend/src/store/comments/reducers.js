import * as Types from "./types";

const initialState = {
  comments: [],
};

export const commentsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.SET_COMMENTS:
      return {
        ...state,
        comments: payload,
      };
    case Types.ADD_COMMENT:
      return {
        ...state,
        comments: [payload, ...state.comments],
      };
    case Types.LIKE_COMMENT:
      return {
        ...state,
        comments: [
          ...(!payload.parent_id
            ? [
                payload,
                ...state.comments.filter(
                  (comment) => comment.id !== payload.id
                ),
              ]
            : [
                ...state.comments.map((comment) =>
                  comment.id === payload.parent_id
                    ? {
                        ...comment,
                        replies: [
                          payload,
                          ...comment.replies.filter(
                            (reply) => reply.id !== payload.id
                          ),
                        ],
                      }
                    : comment
                ),
              ]),
        ],
      };
    case Types.ADD_COMMENT_REPLY:
      return {
        ...state,
        comments: [
          ...state.comments.map((comment) =>
            comment.id === payload.parent_id
              ? { ...comment, replies: [payload, ...comment.replies] }
              : comment
          ),
        ],
      };

    default:
      return state;
  }
};
