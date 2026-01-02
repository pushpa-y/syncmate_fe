import type { RootState } from "../store";
import type { Account } from "../../services/accounts";

// Basic selector to get the accounts obj
export const selectAccounts = (state: RootState) => {
  const data = state.accountList.accounts;
  return Array.isArray(data) ? data : (data as any)?.data || [];
};

// Basic selector to get the loading status
export const selectAccountsLoading = (state: RootState) => state.accountList.loading;

export const selectTotalBalance = (state: RootState): number => {
  const accounts = selectAccounts(state);
  return accounts.reduce((total: number, acc: Account) => total + (acc.balance || 0), 0);
};