import React, { useContext, useState } from "react";
import Loader from "../loader";
import { useDispatch } from "react-redux";
import useAxios from "../../hooks/useAxios";
import { addComment } from "../../store/comments/actions";
import avatarImage from "../../assets/images/avatar.JPG";
import { FeedbackContext } from "../../contexts/feedback";

import "./input.css";

const CommentInput = () => {
  const { notify } = useContext(FeedbackContext);

  const dispatch = useDispatch();

  const [text, setText] = useState("");

  const handleInput = (e) => {
    const { value } = e.target;
    setText(value);
  };

  const {
    result: addCommentFn,
    state: { loading },
  } = useAxios("/comments", "post");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addCommentFn({ data: { text } });
      // dispatch
      dispatch(addComment(result));
      setText("");
    } catch (err) {
      notify.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };
  return (
    <div className="input">
      <div className="input__user">
        <img src={avatarImage} alt="avatar" />
      </div>

      <form className="input__form">
        <input
          type={"text"}
          placeholder="What are your thoughts?"
          className="input__form__text"
          onChange={handleInput}
          value={text}
        />

        <button
          type={"submit"}
          onClick={handleSubmit}
          className="input__form__btn"
        >
          {loading ? <Loader size={20} /> : "Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentInput;
