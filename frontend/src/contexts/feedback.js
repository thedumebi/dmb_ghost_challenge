import React, { createContext, useState } from "react";
import { render } from "react-dom";
import FeedbackCard from "../components/feedback";

export const FeedbackContext = createContext({ notify: () => {} });

const CustomFeedback = ({ children }) => {
  const [node, setNode] = useState(null);

  const notify = (text, duration = 3000, type) => {
    if (node && text) {
      const div = document.createElement("div");
      render(<FeedbackCard text={text} type={type} duration={duration} />, div);
      node.append(div);
      setTimeout(() => {
        div.remove();
      }, duration);
    }
  };

  notify.info = (text, duration) => {
    notify(text, duration);
  };
  notify.error = (text, duration = 3000) => {
    notify(text, duration, "error");
  };
  notify.success = (text, duration = 3000) => {
    notify(text, duration, "success");
  };

  return (
    <FeedbackContext.Provider value={{ notify }}>
      <>
        {children}
        <div ref={setNode} id={"feedback-modal"} className="feedbacks"></div>
        {/* notify container would be rendered here */}
      </>
    </FeedbackContext.Provider>
  );
};

export default CustomFeedback;
