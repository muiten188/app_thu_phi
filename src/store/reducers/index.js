//authen
import authenNavigationReducer from "../../authen/reducers/authen_navigation_reducer";
import loginReducer from "../../authen/reducers/login_reducer";
//app
import navigationReducer from "./root_navigation/root_navigation_reducer";
import searchReducer from "../../store/reducers/containers/search_reducer";
import userInfoReducer from "../../store/reducers/containers/userInfo_reducer";
import billListReducer from "../../store/reducers/containers/billList_reducers";
import billDetailReducer from "../../store/reducers/containers/billDetail_reducers";
import historyReducer from "../../store/reducers/containers/history_reducers";
import app_Reducer from "../../store/reducers/app_reducer";
import * as types from "../../store/constants/action_types";
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
// export default combineReducers({
//   navigationReducer,
//   authenNavigationReducer,
//   loginReducer,
//   searchReducer,
//   userInfoReducer,
//   billListReducer,
//   billDetailReducer,
//   historyReducer,
//   form: formReducer
// });

const appReducer = combineReducers({
  navigationReducer,
  authenNavigationReducer,
  loginReducer,
  searchReducer,
  userInfoReducer,
  billListReducer,
  billDetailReducer,
  historyReducer,
  app_Reducer,
  form: formReducer
});

const rootReducer = (state, action) => {
  if (action.type === types.LOGGED_OUT) {
    state = undefined;
  }
  return appReducer(state, action);
};
 export default rootReducer;