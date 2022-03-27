import thunk from "redux-thunk";
import rootReducer from "./reducers";
import storage from "redux-persist/lib/storage";
import { createStore, applyMiddleware } from "redux";
import {
  persistStore,
  persistReducer,
  getStoredState,
  REHYDRATE,
} from "redux-persist";
import { composeWithDevTools } from "@redux-devtools/extension";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

const middleware = [thunk];

const persistConfig = {
  key: "ghost__root",
  storage,
  stateReconciler: hardSet,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

const crossBrowserListener = (store, persistConfig) => {
  return async function () {
    let state = await getStoredState(persistConfig);

    store.dispatch({
      type: REHYDRATE,
      key: persistConfig.key,
      payload: state,
    });
  };
};

window.addEventListener("storage", crossBrowserListener(store, persistConfig));

export { store, persistor, crossBrowserListener };
