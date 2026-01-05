import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Middleware for async API calls
import { composeWithDevTools } from "@redux-devtools/extension";
import { accountReducer } from "./reducers/accountReducer";
import { entryReducer } from "./reducers/entryReducer";

const reducer = combineReducers({
  accountList: accountReducer,
  entryList: entryReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export type RootState = ReturnType<typeof store.getState>;
export default store;
