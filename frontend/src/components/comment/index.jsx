import React, { useContext, useState } from "react";
import moment from "moment";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { IoMdArrowDropup } from "react-icons/io";
import avatarImage from "../../assets/images/avatar.JPG";
import { FeedbackContext } from "../../contexts/feedback";
import { likeComment, addReply } from "../../store/comments/actions";

import "./comment.css";
import useAxios from "../../hooks/useAxios";
import Loader from "../loader";

const Comment = ({ comment }) => {
  const { notify } = useContext(FeedbackContext);

  const [text, setText] = useState("");

  const [showReplyBox, setShowReplyBox] = useState(false);

  const dispatch = useDispatch();

  const {
    result: addCommenFN,
    state: { loading: laodingReply },
  } = useAxios("/comments", "post");
  const handleKeyDown = async (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      if (!text.trim()) return;
      try {
        if (laodingReply) return;
        const result = await addCommenFN({
          data: { text, parent_id: comment.id },
        });
        dispatch(addReply(result));
        setText("");
        setShowReplyBox(false);
      } catch (err) {
        notify.error(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setText("");
      }
    }
  };

  const {
    result: upvoteFn,
    state: { loading },
  } = useAxios(`/comments/${comment.id}`, "patch");
  const toggleLike = async (e) => {
    e.preventDefault();
    try {
      if (loading) return;
      const result = await upvoteFn({ data: {} });
      dispatch(likeComment(result.comment));
      notify.success(result.message);
    } catch (err) {
      notify.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  return (
    <div
      className={`card${
        comment && comment.replies && comment.replies.length > 0
          ? " border"
          : ""
      }`}
    >
      <div className="card__user">
        <img src={avatarImage} alt="avatar" />
      </div>

      <div className="card__body">
        <div className="card__body__header">
          <h3 className="card__body__header__name">
            {comment?.author?.fullName}
          </h3>
          <span className="card__body__header__time">
            {moment.unix(comment?.time).fromNow()}
          </span>
        </div>

        <div className="card__body__text">{comment.text}</div>

        <div className="card__body__ctas">
          <div className="card__body__ctas__upvote">
            <span>
              <IoMdArrowDropup />
            </span>
            &nbsp;
            <span onClick={toggleLike}>
              {loading ? <Loader size={20} /> : "Upvote"}
            </span>
          </div>
          {!comment?.parent_id && (
            <div className="card__body__ctas__reply">
              {!showReplyBox ? (
                <span onClick={() => setShowReplyBox(true)}>Reply</span>
              ) : (
                <div className="card__body__ctas__reply__box">
                  <MdClose onClick={() => setShowReplyBox(false)} />
                  <input
                    type={"text"}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What are your thoughts?"
                    value={text}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {comment?.replies?.length > 0 && (
          <div className="card__body__replies">
            {comment.replies.map((reply) => (
              <Comment comment={reply} key={reply.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
