import * as types from "../../constants/action_types";
const initState = {
  isLoading: true,
  balance: 200000,
  totalDebit: 0,
  billError: false,
  listResult: [],
  currentPage: 1,
  pageSize: 4,
  billPayError: false
};

export default function (state = initState, action = {}) {
  switch (action.type) {
    case types.BILL_LIST:
      return {
        ...state,
        listResult: action.listResult,
        isLoading: false,
        billError: initState.billError,
        currentPage: initState.currentPage
      };
    case types.BILL_LISTING:
      return {
        ...state,
        isLoading: true,
        billError: initState.billError
      };
    case types.BALANCE:
      return {
        ...state,
        billError: initState.billError,
        // balance:action.balance,
        balance: action.balance == null ? initState.balance : action.balance,
        totalDebit:
          action.totalDebit == null ? initState.totalDebit : action.totalDebit
      };
    case types.LIST_ERROR:
      return {
        ...state,
        isLoading: false,
        billError: true
      };
    case types.FETCH_CATCH:
      return {
        ...state,
        isLoading: false,
        billError: true
      };
    case types.LIST_RESET:
      return {
        ...state,
        ...initState
      };
    case types.BILL_LIST_LOADMORE:
      return {
        ...state,
        listResult: [...state.listResult, ...action.listResult],
        isLoading: false,
        billError: initState.billError,
        currentPage: state.currentPage + 1
      };
    case types.BILL_FROM_ID:
      for (var i = 0; i < state.listResult.length; i++) {
        if (state.listResult[i].invoiceId == action.bill.invoiceId) {
          state.listResult[i] = action.bill;
        }
      }
      return {
        ...state,
        listResult: [...state.listResult],
        isLoading: false,
        billError: initState.billError
      };
    case types.LIST_BILL_PAY_ERROR:
      return {
        ...state,
        isLoading: false,
        billPayError: true
      };
    case types.BILL_LIST_CLEAR_ERROR:
      return {
        ...state,
        billPayError: initState.billPayError,
        billError: initState.billError
      };
    default:
      return state;
  }
}
