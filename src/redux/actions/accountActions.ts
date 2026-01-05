import { getAccounts } from "../../services/accounts";
import {
  ACCOUNT_LIST_REQUEST,
  ACCOUNT_LIST_SUCCESS,
  ACCOUNT_LIST_FAIL,
  SET_ACTIVE_ACCOUNT,
} from "../constants/accountConstants";
import * as accountService from "../../services/accounts";

const getAuthToken = () =>
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!).token
    : localStorage.getItem("token");

export const setActiveAccount =
  (accountId: string | null) => (dispatch: any) => {
    if (accountId) {
      localStorage.setItem("activeAccount", accountId);
    } else {
      localStorage.removeItem("activeAccount");
    }
    dispatch({ type: SET_ACTIVE_ACCOUNT, payload: accountId });
  };

export const listAccounts = (token?: string) => async (dispatch: any) => {
  try {
    const authToken = token || getAuthToken();
    if (!authToken) return;

    dispatch({ type: ACCOUNT_LIST_REQUEST });
    const { data } = await getAccounts(authToken);
    dispatch({ type: ACCOUNT_LIST_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: ACCOUNT_LIST_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const createAccount =
  (accountData: { name: string; balance: number }) => async (dispatch: any) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      await accountService.createAccount(token, accountData);
      await dispatch(listAccounts(token) as any);
    } catch (error: any) {
      console.error("Create account error:", error);
      throw error;
    }
  };

export const updateAccount =
  (id: string, data: any) => async (dispatch: any) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await accountService.updateAccount(token, id, data);
      await dispatch(listAccounts(token) as any);
    } catch (error: any) {
      console.error("Update error:", error);
      throw error;
    }
  };

export const deleteAccount = (id: string) => async (dispatch: any) => {
  try {
    const token = getAuthToken();
    if (!token) return;

    await accountService.deleteAccount(token, id);
    await dispatch(listAccounts(token) as any);
  } catch (error: any) {
    console.error("Delete error:", error);
    throw error;
  }
};
