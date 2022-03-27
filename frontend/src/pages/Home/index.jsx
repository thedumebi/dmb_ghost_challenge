import React, { useContext, useEffect } from "react";
import Input from "../../components/input";
import useAxios from "../../hooks/useAxios";
import Loader from "../../components/loader";
import Comment from "../../components/comment";
import { useDispatch, useSelector } from "react-redux";
import { FeedbackContext } from "../../contexts/feedback";
import { setComments } from "../../store/comments/actions";

import "./home.css";

const Home = () => {
  const { notify } = useContext(FeedbackContext);

  const dispatch = useDispatch();

  const comments = useSelector(({ comments }) => comments.comments);

  const {
    result: getCommentsFn,
    state: { loading },
  } = useAxios("/comments", "get");
  const getComments = async () => {
    try {
      if (loading) return;
      const results = await getCommentsFn();
      // dispatch
      dispatch(setComments(results));
    } catch (err) {
      notify.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h3>Discussion</h3>

      <Input />

      <hr />

      {loading ? (
        <div className="container__loader">
          <Loader size={40} />
        </div>
      ) : (
        <>
          {comments && comments.length > 0 ? (
            <div className="container__comments">
              {comments.map((comment) => (
                <Comment comment={comment} key={comment.id} />
              ))}
            </div>
          ) : (
            <div>No comments available</div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
