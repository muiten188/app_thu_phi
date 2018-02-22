import * as types from "../../constants/action_types";
const initState = {
  isLoading: true,
  listResult: [],
  historyError: false
};

export default function (state = initState, action = {}) {
  switch (action.type) {
    case types.HISTORYING:
      return {
        ...state,
        isLoading: true,
        historyError: initState.historyError
      };
    case types.HISTORY:
      return {
        ...state,
        listResult: action.listResult,
        isLoading: false,
        historyError: initState.historyError
      };
    case types.HISTORY_ERROR:
      return {
        ...state,
        isLoading: false,
        historyError: true
      };
    case types.HISTORY_CLEAR_ERROR:
      return {
        ...state,
        historyError: initState.historyError
      };
    default:
      return state;
  }
}
