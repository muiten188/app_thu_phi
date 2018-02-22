import * as types from "../../constants/action_types";
const initState = {
  isLoading: true,
  user:{}
};

export default function(state = initState, action = {}) {
  switch (action.type) {
    case types.USER_INFO:
      return {
        ...state,
        user:action.user
      };
    default:
      return state;
  }
}
