import { useState, useEffect } from "react";

import "./feedback.css";

const FeedbackCard = ({ text, type, duration = 3000 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow((value) => !value);
    }, 100);

    setTimeout(() => {
      setShow((value) => !value);
    }, duration);
  }, []);
  return (
    <div className={`card_wrapper${show ? " show" : ""}`}>
      <div className={`feedback_card${type ? ` ${type}` : ""}`}>{text}</div>
    </div>
  );
};

export default FeedbackCard;
