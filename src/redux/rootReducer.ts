import { combineReducers } from "redux";
//import { entryReducer } from "./reducers/entryReducer";
import { accountReducer } from "./reducers/accountReducer";

const rootReducer = combineReducers({
  //entryList: entryReducer,
  accountList: accountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
