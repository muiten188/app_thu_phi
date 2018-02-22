import * as types from "../../constants/action_types";
const initState = {
  isLoading: false,
  transactionCode: null,
  billPayError: false
};

export default function (state = initState, action = {}) {
  switch (action.type) {
    case types.BILL_PAY:
      return {
        ...state,
        isLoading: false,
        transactionCode: action.transactionCode,
        billPayError: initState.billPayError
      };
    case types.BILL_PAYING:
      return {
        ...state,
        isLoading: true,
        transactionCode: null,
        billPayError: initState.billPayError
      };
    case types.BILL_PAY_ERROR:
      return {
        ...state,
        isLoading: false,
        transactionCode: action.transactionCode,
        billPayError: true
      };
    case types.FETCH_CATCH:
      return {
        ...state,
        isLoading: false,
        billPayError: true
      };
    case types.BILL_DETAIL_CLEAR_ERROR:
      return {
        ...state,
        billPayError: initState.billPayError,
      };
    default:
      return state;
  }
}
