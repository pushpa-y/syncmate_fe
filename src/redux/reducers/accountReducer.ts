import { 
  ACCOUNT_LIST_REQUEST, 
  ACCOUNT_LIST_SUCCESS, 
  ACCOUNT_LIST_FAIL 
} from '../constants/accountConstants';

const initialState = {
  accounts: [],
  loading: false,
  error: null
};

export const accountReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ACCOUNT_LIST_REQUEST:
      return { ...state, loading: true };
    case ACCOUNT_LIST_SUCCESS:
      return { loading: false, accounts: action.payload, error: null };
    case ACCOUNT_LIST_FAIL:
      return { loading: false, error: action.payload, accounts: [] };
    default:
      return state;
  }
};