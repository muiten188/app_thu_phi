import { combineReducers } from "redux";
import { NavigationActions } from "react-navigation";
import * as action_types from "../../constants/action_types";
import { RootNavigationContainer } from "../../../routers/root_navigation_config";
const mainAction = RootNavigationContainer.router.getActionForPathAndParams(
  "Search"
);
const initialNavState = RootNavigationContainer.router.getStateForAction(
  mainAction
);
// const initialNavState = RootNavigationContainer.router.getStateForAction(
//     mainAction,
//     0//index default 0
// );

function navigationReducer(state = initialNavState || {}, action = {}) {
  let nextState;
  switch (action.type) {
    case action_types.PUSH_ROUTE:
      switch (action.route.id) {
        case "UserInfo":
          nextState = RootNavigationContainer.router.getStateForAction(
            NavigationActions.navigate({
              routeName: action.route.id,
              // params: { oFilmServer: action.route.oFilmServer },
              action: NavigationActions.navigate({ routeName: action.route.id })
            }),
            state
          );
          break;
        case "Search":
          nextState = RootNavigationContainer.router.getStateForAction(
            NavigationActions.navigate({
              routeName: action.route.id,
              // params: { oFilmServer: action.route.oFilmServer },
              action: NavigationActions.navigate({ routeName: action.route.id })
            }),
            state
          );
          break;
        case "BillList":
          nextState = RootNavigationContainer.router.getStateForAction(
            NavigationActions.navigate({
              routeName: action.route.id,
              params: { apartment: action.route.apartment },
              action: NavigationActions.navigate({ routeName: action.route.id })
            }),
            state
          );
          break;
        case "BillDetail":
          nextState = RootNavigationContainer.router.getStateForAction(
            NavigationActions.navigate({
              routeName: action.route.id,
              params: {
                bill: action.route.bill,
                balance: action.route.balance,
                totalDebit: action.route.totalDebit,
                apartment: action.route.apartment
              },
              action: NavigationActions.navigate({ routeName: action.route.id })
            }),
            state
          );
          break;
        case "History":
          nextState = RootNavigationContainer.router.getStateForAction(
            NavigationActions.navigate({
              routeName: action.route.id,
              params: { apartment: action.route.apartment },
              action: NavigationActions.navigate({ routeName: action.route.id })
            }),
            state
          );
          break;
        default:
          nextState = RootNavigationContainer.router.getStateForAction(
            NavigationActions.navigate({ routeName: action.route.id }),
            state
          );
          break;
      }
      break;
    case action_types.POP_ROUTE:
      nextState = RootNavigationContainer.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case action_types.RESET_ROUTE:
      nextState = RootNavigationContainer.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: action.routeName })]
        }),
        state
      );
      break;
    default:
      nextState = RootNavigationContainer.router.getStateForAction(
        action,
        state
      );
      break;
  }

  return nextState || state;
}
export default navigationReducer;
