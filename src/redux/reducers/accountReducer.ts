import {
  ACCOUNT_LIST_REQUEST,
  ACCOUNT_LIST_SUCCESS,
  ACCOUNT_LIST_FAIL,
  SET_ACTIVE_ACCOUNT,
} from "../constants/accountConstants";
import type { Account } from "../../services/accounts";

interface AccountState {
  accounts: Account[];
  activeAccount: string | null;
  loading: boolean;
  error: any;
}

const initialState: AccountState = {
  accounts: [],
  activeAccount: localStorage.getItem("activeAccount") || "all",
  loading: false,
  error: null,
};

export const accountReducer = (
  state = initialState,
  action: any,
): AccountState => {
  switch (action.type) {
    case ACCOUNT_LIST_REQUEST:
      return { ...state, loading: true };

    case ACCOUNT_LIST_SUCCESS:
      return {
        ...state, // MUST spread state to keep activeAccount
        loading: false,
        accounts: action.payload,
        error: null,
      };

    case ACCOUNT_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        accounts: [],
      };

    case SET_ACTIVE_ACCOUNT:
      return {
        ...state,
        activeAccount: action.payload,
      };

    default:
      return state;
  }
};
