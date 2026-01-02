import { getAccounts } from "../../services/accounts"; // Use your existing service
import {
  ACCOUNT_LIST_REQUEST,
  ACCOUNT_LIST_SUCCESS,
  ACCOUNT_LIST_FAIL,
} from "../constants/accountConstants";

export const listAccounts = (token: string) => async (dispatch: any) => {
  try {
    dispatch({ type: ACCOUNT_LIST_REQUEST });

    //service function that already handles the axios instance
    const { data } = await getAccounts(token);

    dispatch({
      type: ACCOUNT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: ACCOUNT_LIST_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};
