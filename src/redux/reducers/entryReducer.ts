import {
  ENTRY_LIST_REQUEST,
  ENTRY_LIST_SUCCESS,
  ENTRY_LIST_FAIL,
  ENTRY_DELETE_SUCCESS,
} from "../constants/entryConstants";
import { SET_ACTIVE_ACCOUNT } from "../constants/accountConstants";
import type { Entry } from "../../services/Entry";

interface EntryState {
  entries: Entry[];
  page: number;
  pages: number;
  loading: boolean;
  error: any;
}

const initialState: EntryState = {
  entries: [],
  page: 1,
  pages: 1,
  loading: false,
  error: null,
};

export const entryReducer = (state = initialState, action: any): EntryState => {
  switch (action.type) {
    case ENTRY_LIST_REQUEST:
      return { ...state, loading: true };

    //Adding this case to clear the list immediately when account changes
    case SET_ACTIVE_ACCOUNT:
      return {
        ...state,
        entries: [],
        pages: 1,
        loading: true,
      };

    case ENTRY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        //Replace if page 1 (refresh/filter), Append if page > 1 (load more)
        entries:
          action.payload.page === 1
            ? action.payload.entries
            : [...state.entries, ...action.payload.entries],
        page: action.payload.page,
        pages: action.payload.pages,
        error: null,
      };

    case ENTRY_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ENTRY_DELETE_SUCCESS:
      return {
        ...state,
        entries: state.entries.filter(
          (entry: Entry) => entry._id !== action.payload,
        ),
      };

    default:
      return state;
  }
};
