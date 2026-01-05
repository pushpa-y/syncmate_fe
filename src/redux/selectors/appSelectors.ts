import type { RootState } from "../store";
import type { Entry } from "../../services/Entry";

// 1. Basic selectors
export const selectEntries = (state: RootState): Entry[] =>
  state.entryList.entries || [];
export const selectEntriesLoading = (state: RootState) =>
  state.entryList.loading;

export const selectCurrentPage = (state: any) => state.entryList.page ?? 1;
export const selectTotalPages = (state: any) => state.entryList.pages ?? 1;
export const selectPagination = (state: RootState) => ({
  // The '?? 1' provides a fallback so the UI doesn't break
  page: state.entryList?.page ?? 1,
  pages: state.entryList?.pages ?? 1,
});

// 2. Financial Summary Selectors
export const selectTotalIncome = (state: RootState): number => {
  const entries = selectEntries(state);
  return entries
    .filter((e) => e.entryType === "income")
    .reduce((sum, e) => sum + Number(e.value || 0), 0);
};

export const selectTotalExpenses = (state: RootState): number => {
  const entries = selectEntries(state);
  return entries
    .filter((e) => e.entryType === "expense")
    .reduce((sum, e) => sum + Number(e.value || 0), 0);
};

// 3. FEATURE: Predictive Analytics Selector
// Calculates average daily spend and projects it to the end of the month
export const selectCashFlowForecast = (state: RootState) => {
  const entries = selectEntries(state);
  const expenses = entries.filter((e) => e.entryType === "expense");

  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const remainingDays = daysInMonth - dayOfMonth;

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.value || 0), 0);

  // Avoid division by zero on day 1
  const avgDailySpend = dayOfMonth > 0 ? totalSpent / dayOfMonth : 0;
  const predictedFutureSpend = avgDailySpend * remainingDays;

  return {
    avgDailySpend: Math.round(avgDailySpend),
    predictedEndBalance: Math.round(predictedFutureSpend),
    isOverspending: avgDailySpend > 1500, // Example threshold
  };
};

import type { Account } from "../../services/accounts";

export const selectAccounts = (state: any) => state.accountList.accounts;
export const selectActiveAccount = (state: any) =>
  state.accountList.activeAccount;

// Basic selector to get the loading status
export const selectAccountsLoading = (state: RootState) =>
  state.accountList.loading;

export const selectTotalBalance = (state: RootState): number => {
  const accounts = selectAccounts(state);
  return accounts.reduce(
    (total: number, acc: Account) => total + (acc.balance || 0),
    0,
  );
};
