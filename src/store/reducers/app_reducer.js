import * as types from "../constants/action_types";
const initState = {
  isLoading: false,
  showPayInfo: false,
  listPayError: false,
  payInfo: {}
};

export default function (state = initState, action = {}) {
  switch (action.type) {
    case types.CLOSE_PAYINFO:
      return {
        ...state,
        isLoading: initState.isLoading,
        showPayInfo: false,
      };
    case types.SHOW_PAYINFO:
      return {
        ...state,
        isLoading: initState.isLoading,
        showPayInfo: true
      };
    case types.LIST_PAY_INFO:
      return {
        ...state,
        isLoading: initState.isLoading,
        payInfo: action.payInfo,
        listPayError: initState.listPayError
      };
    case types.LISTING_PAY_INFO:
      return {
        ...state,
        isLoading: true,
        listPayError: initState.listPayError
      };
    case types.LIST_PAY_ERROR:
      return {
        ...state,
        isLoading: initState.isLoading,
        listPayError: true
      }
    case types.LISTPAYINFO_CLEAR_ERROR:
      return {
        ...state,
        isLoading: initState.isLoading,
        listPayError: initState
      }
    default:
      return state;
  }
}
