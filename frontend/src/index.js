import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { Provider } from "react-redux";
import { configure } from "axios-hooks";
import axios from "./config/axios.config";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

configure({ axios });

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
