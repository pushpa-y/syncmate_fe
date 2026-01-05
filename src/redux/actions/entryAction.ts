import {
  ENTRY_LIST_REQUEST,
  ENTRY_LIST_SUCCESS,
  ENTRY_LIST_FAIL,
} from "../constants/entryConstants";
import { getEntries } from "../../services/Entry";

/**
 * Fetches entries from the backend and updates the Redux store.
 * Supports pagination, filtering, and sorting.
 */
export const listEntries =
  (
    token: string,
    opts?: {
      accountId?: string;
      page?: number;
      limit?: number;
      filter?: string;
      search?: string;
      sortBy?: string;
      category?: string;
    },
  ) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: ENTRY_LIST_REQUEST });

      // Calling your service file
      const { data } = await getEntries(token, opts);

      dispatch({
        type: ENTRY_LIST_SUCCESS,
        payload: {
          entries: data.entries,
          page: data.page,
          pages: data.pages,
          total: data.total,
        },
      });
    } catch (error: any) {
      dispatch({
        type: ENTRY_LIST_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
