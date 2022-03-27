import React from "react";
import Home from "./pages/Home";
import CustomFeedback from "./contexts/feedback";

import "./App.css";

function App() {
  return (
    <CustomFeedback>
      <Home />
    </CustomFeedback>
  );
}

export default App;
