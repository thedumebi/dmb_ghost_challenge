import { combineReducers } from "redux";
import { RESET_STORE } from "./app/types";
import { commentsReducer } from "./comments/reducers";

const appRootReducer = combineReducers({
  comments: commentsReducer,
});

const rootReducers = (state, action) => {
  if (action.type === RESET_STORE) {
    state = {};
  }

  return appRootReducer(state, action);
};

export default rootReducers;
